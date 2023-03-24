import {
  Chunk,
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
  RpcSchemaIO,
  RpcSchemaNoError,
  RpcSchemaNoInputNoError,
  schemaMethodsMap,
  RpcSchemas,
} from "@effect/rpc"
import {
  decode,
  decodeEffect,
  encode,
  encodeEffect,
} from "@effect/rpc/internal/decode"

export { makeSchema as schema } from "@effect/rpc"

export type RpcDefinition<R, E, I, O> =
  | RpcDefinitionIO<R, E, I, O>
  | Effect.Effect<R, E, O>

export type RpcDefinitionAny = RpcDefinition<any, any, any, any>

export type RpcDefinitionIO<R, E, I, O> = (input: I) => Effect.Effect<R, E, O>

export interface RpcHandlerSchemaNoInput<E, O> {
  output: Schema.Schema<O>
  error: Schema.Schema<E>
}

export type RpcDefinitionFromSchema<C extends RpcSchemaAny> =
  C extends RpcSchemaIO<
    infer _IE,
    infer E,
    infer _II,
    infer I,
    infer _IO,
    infer O
  >
    ? RpcDefinitionIO<any, E, I, O>
    : C extends RpcSchemaNoError<infer _II, infer I, infer _IO, infer O>
    ? RpcDefinitionIO<any, never, I, O>
    : C extends RpcSchemaNoInput<infer _IE, infer E, infer _IO, infer O>
    ? Effect.Effect<any, E, O>
    : C extends RpcSchemaNoInputNoError<infer _IO, infer O>
    ? Effect.Effect<any, never, O>
    : never

export interface RpcHandlers
  extends Record<string, RpcDefinitionAny | { handlers: RpcHandlers }> {}

export type RpcHandlersFromSchema<S extends RpcSchemas> = {
  [K in Extract<keyof S, string>]: S[K] extends RpcSchemas
    ? { handlers: RpcHandlersFromSchema<S[K]> }
    : S[K] extends RpcSchemaAny
    ? RpcDefinitionFromSchema<S[K]>
    : never
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

const schemaHandlersMap = <H extends RpcHandlers>(
  handlers: H,
  prefix = "",
): Record<string, RpcDefinitionAny> =>
  Object.entries(handlers).reduce((acc, [method, definition]) => {
    if ("handlers" in definition) {
      return {
        ...acc,
        ...schemaHandlersMap(definition.handlers, `${prefix}${method}.`),
      }
    }
    return { ...acc, [`${prefix}${method}`]: definition }
  }, {})

const responseEncoder = Parser.encode(RpcResponse)

export const handleSingleRequest = <R extends RpcRouterBase>(
  router: R,
): ((request: {
  readonly method: string
  readonly input?: unknown
}) => Effect.Effect<RpcHandlersDeps<R["handlers"]>, never, unknown>) => {
  const schemaMap = schemaMethodsMap(router.schema)
  const handlerMap = schemaHandlersMap(router.handlers)

  return (request) =>
    pipe(
      Either.Do,
      Either.bind("schema", () =>
        Either.fromNullable(
          schemaMap[request.method],
          (): RpcNotFound => ({
            _tag: "RpcNotFound",
            method: request.method,
          }),
        ),
      ),
      Either.bind("handler", () =>
        Either.fromNullable(
          handlerMap[request.method],
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
        const effect: Effect.Effect<any, unknown, unknown> = Effect.isEffect(
          handler,
        )
          ? handler
          : (handler as any)(input)

        return pipe(
          effect,
          Effect.map(encode(schema.output)),
          Effect.catchAll((_) =>
            Effect.succeed(
              Either.flatMap(
                encode(
                  "error" in schema ? schema.error : (Schema.never as any),
                )(_),
                Either.left,
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
}

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
  input: unknown,
) => Effect.Effect<RpcHandlersDeps<R["handlers"]>, never, unknown>) => {
  const handler = handleSingleRequest(router)

  return (u) =>
    pipe(
      requestDecoder(u),
      Effect.orDie,
      Effect.flatMap((requests) => Effect.collectAllPar(requests.map(handler))),
      Effect.map(Chunk.toReadonlyArray),
    )
}

export interface UndecodedRpcResponse<M, O> {
  readonly __rpc: M
  readonly __output: O
}

export type RpcUndecodedClient<H extends RpcHandlers, P extends string = ""> = {
  [K in Extract<keyof H, string>]: H[K] extends { handlers: RpcHandlers }
    ? RpcUndecodedClient<H[K]["handlers"], `${P}${K}.`>
    : H[K] extends RpcDefinitionIO<infer R, infer E, infer I, infer O>
    ? (input: I) => Effect.Effect<R, E, UndecodedRpcResponse<`${P}${K}`, O>>
    : H[K] extends Effect.Effect<infer R, infer E, infer O>
    ? Effect.Effect<R, E, UndecodedRpcResponse<`${P}${K}`, O>>
    : never
}

export const makeUndecodedClient = <
  S extends RpcSchemas,
  H extends RpcHandlersFromSchema<S>,
>(
  schemas: S,
  handlers: H,
): RpcUndecodedClient<H> =>
  Object.entries(handlers as RpcHandlers).reduce(
    (acc, [method, definition]) => {
      if ("handlers" in definition) {
        return {
          ...acc,
          [method]: makeUndecodedClient(
            schemas[method] as any,
            definition.handlers as any,
          ),
        }
      }

      const schema = schemas[method] as RpcSchemaAny

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
        [method]: (input: unknown) =>
          pipe(
            (definition as RpcDefinitionIO<any, any, any, any>)(input),
            Effect.flatMap(encodeEffect(schema.output)),
            Query.fromEffect,
          ),
      }
    },
    {} as any,
  )
