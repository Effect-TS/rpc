import {
  Effect,
  Either,
  identity,
  Parser,
  pipe,
  Schema,
} from "@effect/rpc/internal/common"

import {
  RpcNotFound,
  RpcRequest,
  RpcResponse,
  RpcSchemaAny,
  RpcSchemaNoInput,
  RpcSchemas,
  RpcSchemaWithInput,
} from "./index.js"

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

const requestDecoder = Parser.decode(RpcRequest)
const responseEncoder = Parser.encode(RpcResponse)

export type RpcServer<H extends RpcHandlers> = (
  u: unknown,
) => Effect.Effect<RpcHandlersDeps<H>, never, unknown>

export const makeRouter = <
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

export const makeHandler =
  <R extends RpcRouterBase>(
    router: R,
  ): ((
    u: unknown,
  ) => Effect.Effect<RpcHandlersDeps<R["handlers"]>, never, unknown>) =>
  (u) =>
    pipe(
      Either.Do,
      Either.bind("request", () => requestDecoder(u)),
      Either.bind("schema", ({ request }) =>
        Either.fromNullable(
          (): RpcNotFound => ({
            _tag: "RpcNotFound",
            method: request.method,
          }),
        )(router.schema[request.method]),
      ),
      Either.bind("handler", ({ request }) =>
        Either.fromNullable(
          (): RpcNotFound => ({
            _tag: "RpcNotFound",
            method: request.method,
          }),
        )(router.handlers[request.method]),
      ),
      Either.bind("input", ({ handler, schema, request }) =>
        !Effect.isEffect(handler) && "input" in schema
          ? Parser.decode(schema.input as Schema.Schema<any>)(request.input)
          : Either.right(null),
      ),
      Either.map(({ handler, input, schema }) => {
        const effect: Effect.Effect<any, any, any> = Effect.isEffect(handler)
          ? handler
          : handler(input)

        return pipe(
          Effect.either(effect),
          Effect.map((_) => Either.right(Parser.encode(schema.output)(_))),
          Effect.catchAll((_) =>
            Effect.succeed(
              Either.left(Parser.encode(schema.error as Schema.Schema<any>)(_)),
            ),
          ),
        )
      }),
      Either.match(
        (_) => Effect.succeed(responseEncoder(Either.left(_))),
        identity,
      ),
    )

export interface UndecodedRpcResponse<M> {
  readonly __rpc: M
}

export type RpcUndecodedClient<H extends RpcHandlers> = {
  [K in keyof H]: H[K] extends RpcDefinitionIO<infer R, infer E, infer I, any>
    ? (input: I) => Effect.Effect<R, E, UndecodedRpcResponse<K>>
    : H[K] extends Effect.Effect<infer R, infer E, any>
    ? Effect.Effect<R, E, UndecodedRpcResponse<K>>
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
          [method]: pipe(definition, Effect.map(Parser.encode(schema.output))),
        }
      }

      return {
        ...acc,
        [method]: (input) =>
          pipe(definition(input), Effect.map(Parser.encode(schema.output))),
      }
    },
    {} as any,
  )
