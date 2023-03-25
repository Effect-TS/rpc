import * as Chunk from "@effect/data/Chunk"
import { pipe } from "@effect/data/Function"
import * as Effect from "@effect/io/Effect"
import * as Query from "@effect/query/Query"
import {
  RpcSchemaAny,
  RpcSchemaIO,
  RpcSchemaNoError,
  RpcSchemaNoInput,
  RpcSchemaNoInputNoError,
  RpcSchemas,
} from "@effect/rpc/Schema"
import { encodeEffect, requestDecoder } from "@effect/rpc/internal/decode"
import {
  handleRequestUnion,
  handleSingleRequest,
} from "@effect/rpc/internal/server"
import * as Schema from "@effect/schema/Schema"

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

export type RpcHandlerMap<H extends RpcHandlers, P extends string = ""> = {
  [K in keyof H]: K extends string
    ? H[K] extends { handlers: RpcHandlers }
      ? RpcHandlerMap<H[K]["handlers"], `${P}${K}.`>
      : H[K] extends RpcDefinitionIO<infer R, infer E, infer _I, infer O>
      ? [`${P}${K}`, Effect.Effect<R, E, O>]
      : [`${P}${K}`, H[K]]
    : never
}[keyof H]

export type RpcHandlerFromMethod<M, H extends RpcHandlers> = Extract<
  RpcHandlerMap<H>,
  [M, any]
> extends [infer _M, infer T]
  ? T
  : never

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

export const handlerDirect = handleRequestUnion

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
