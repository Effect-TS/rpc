import {
  Effect,
  Either,
  identity,
  Parser,
  pipe,
  Query,
  Schema,
} from "@effect/rpc/internal/common"
import {
  RpcNotFound,
  RpcResponse,
  RpcSchemaAny,
  RpcSchemaNoInput,
  RpcSchemas,
  RpcSchemaWithInput,
} from "./index.js"
import { decode, decodeEffect, encodeEffect } from "./internal/decode.js"

export { makeSchema as schema } from "./index.js"

export type RpcDefinition<R, E, I, O> =
  | RpcDefinitionIO<R, E, I, O>
  | Effect.Effect<R, E, O>

export type RpcDefinitionAny =
  | RpcDefinition<any, any, any, any>
  | RpcDefinition<any, never, any, any>
  | RpcDefinition<any, any, any, never>

export type RpcDefinitionIO<R, E, I, O> = (input: I) => Effect.Effect<R, E, O>

export interface RpcHandlerSchemaNoInput<E, O> {
  output: Schema.Schema<O>
  error: Schema.Schema<E>
}

export type RpcDefinitionFromSchema<C extends RpcSchemaAny> =
  C extends RpcSchemaWithInput<infer E, infer I, infer O>
    ? RpcDefinitionIO<any, E, I, O>
    : C extends RpcSchemaNoInput<infer E, infer O>
    ? Effect.Effect<any, E, O>
    : never

export interface RpcHandlers extends Record<string, RpcDefinitionAny> {}

export type RpcHandlersFromSchema<S extends RpcSchemas> = {
  [K in keyof S]: RpcDefinitionFromSchema<S[K]>
}

export type RpcHandlersDeps<H extends RpcHandlers> =
  H[keyof H] extends RpcDefinition<infer Deps, any, any, any> ? Deps : never

export type RpcHandlersE<H extends RpcHandlers> =
  H[keyof H] extends RpcDefinition<any, infer E, any, any> ? E : never

export interface RpcRouterBase {
  readonly handlers: RpcHandlers
  readonly schema: RpcSchemas
  readonly undecoded: RpcUndecodedClient<RpcHandlers>
}

export interface RpcRouter<
  S extends RpcSchemas,
  H extends RpcHandlersFromSchema<S>,
> extends RpcRouterBase {
  readonly handlers: H
  readonly schema: S
  readonly undecoded: RpcUndecodedClient<H>
}

const responseEncoder = Parser.encodeOrThrow(RpcResponse)

export type RpcServer<H extends RpcHandlers> = (
  u: unknown,
) => Effect.Effect<RpcHandlersDeps<H>, never, unknown>

export const router = <
  S extends RpcSchemas,
  H extends RpcHandlersFromSchema<S>,
>(
  schema: S,
  handlers: H,
): RpcRouter<S, H> => ({
  schema,
  handlers,
  undecoded: makeUndecodedClient(schema, handlers),
})

const handleSingleRequest =
  <R extends RpcRouterBase>(
    router: R,
  ): ((request: {
    readonly method: string
    readonly input: unknown
  }) => Effect.Effect<RpcHandlersDeps<R["handlers"]>, never, unknown>) =>
  (request) =>
    pipe(
      Either.Do,
      Either.bind("schema", () =>
        Either.fromNullable(
          router.schema[request.method],
          (): RpcNotFound => ({
            _tag: "RpcNotFound",
            method: request.method,
          }),
        ),
      ),
      Either.bind("handler", () =>
        Either.fromNullable(
          router.handlers[request.method],
          (): RpcNotFound => ({
            _tag: "RpcNotFound",
            method: request.method,
          }),
        ),
      ),
      Either.bind("input", ({ handler, schema }) =>
        !Effect.isEffect(handler) && "input" in schema
          ? decode(schema.input as Schema.Schema<any>)(request.input)
          : Either.right(null),
      ),
      Either.map(({ handler, input, schema }) => {
        const effect: Effect.Effect<any, any, any> = Effect.isEffect(handler)
          ? handler
          : handler(input)

        return pipe(
          effect,
          Effect.map((_) =>
            Either.right(Parser.encodeOrThrow(schema.output)(_)),
          ),
          Effect.catchAll((_) =>
            Effect.succeed(
              Either.left(
                Parser.encodeOrThrow(schema.error as Schema.Schema<any>)(_),
              ),
            ),
          ),
        )
      }),
      Either.match(
        (_) => Effect.succeed(responseEncoder(Either.left(_))),
        identity,
      ),
    )

const requestDecoder = decodeEffect(
  Schema.array(
    Schema.struct({
      method: Schema.string,
      input: Schema.unknown,
    }),
  ),
)

export const handler = <R extends RpcRouterBase>(
  router: R,
): ((
  u: unknown,
) => Effect.Effect<RpcHandlersDeps<R["handlers"]>, never, unknown>) => {
  const handler = handleSingleRequest(router)
  return (u) =>
    pipe(
      requestDecoder(u),
      Effect.orDie,
      Effect.flatMap((requests) => Effect.collectAllPar(requests.map(handler))),
      Effect.map((_) => _.toReadonlyArray()),
    )
}

export interface UndecodedRpcResponse<M> {
  readonly __rpc: M
}

export type RpcUndecodedClient<H extends RpcHandlers> = {
  [K in keyof H]: H[K] extends RpcDefinitionIO<infer R, infer E, infer I, any>
    ? (input: I) => Query.Query<R, E, UndecodedRpcResponse<K>>
    : H[K] extends Query.Query<infer R, infer E, any>
    ? Query.Query<R, E, UndecodedRpcResponse<K>>
    : never
}

export const makeUndecodedClient = <
  S extends RpcSchemas,
  H extends RpcHandlersFromSchema<S>,
>(
  schemas: S,
  handlers: H,
) =>
  Object.entries(handlers as RpcHandlers).reduce<RpcUndecodedClient<H>>(
    (acc, [method, definition]) => {
      const schema = schemas[method]

      if (Effect.isEffect(definition)) {
        return {
          ...acc,
          [method]: pipe(
            definition,
            Effect.flatMap(encodeEffect(schema.output)),
            Query.fromEffect,
          ),
        }
      }

      return {
        ...acc,
        [method]: (input) =>
          pipe(
            definition(input),
            Effect.flatMap(encodeEffect(schema.output)),
            Query.fromEffect,
          ),
      }
    },
    {} as any,
  )
