import * as Chunk from "@effect/data/Chunk"
import { pipe } from "@effect/data/Function"
import * as Effect from "@effect/io/Effect"
import * as Query from "@effect/query/Query"
import type {
  RpcRequestSchema,
  RpcSchema,
  RpcService,
} from "@effect/rpc/Schema"
import { encodeEffect, requestDecoder } from "@effect/rpc/internal/codec"
import {
  handleRequestUnion,
  handleSingleRequest,
} from "@effect/rpc/internal/server"
import * as Schema from "@effect/schema/Schema"

/**
 * @category models
 * @since 1.0.0
 */
export type RpcHandler<R, E, I, O> =
  | RpcHandler.IO<R, E, I, O>
  | Effect.Effect<R, E, O>

/**
 * @since 1.0.0
 */
export namespace RpcHandler {
  /**
   * @category models
   * @since 1.0.0
   */
  export type IO<R, E, I, O> = (input: I) => Effect.Effect<R, E, O>

  /**
   * @category models
   * @since 1.0.0
   */
  export type Any = RpcHandler<any, any, any, any>

  /**
   * @category models
   * @since 1.0.0
   */
  export type FromSchema<C extends RpcSchema.Any> = C extends RpcSchema.IO<
    infer _IE,
    infer E,
    infer _II,
    infer I,
    infer _IO,
    infer O
  >
    ? IO<any, E, I, O>
    : C extends RpcSchema.NoError<infer _II, infer I, infer _IO, infer O>
    ? IO<any, never, I, O>
    : C extends RpcSchema.NoInput<infer _IE, infer E, infer _IO, infer O>
    ? Effect.Effect<any, E, O>
    : C extends RpcSchema.NoInputNoError<infer _IO, infer O>
    ? Effect.Effect<any, never, O>
    : never

  /**
   * @category models
   * @since 1.0.0
   */
  export type FromMethod<M, H extends RpcHandlers> = Extract<
    RpcHandlers.Map<H>,
    [M, any]
  > extends [infer _M, infer T]
    ? T
    : never
}

/**
 * @category models
 * @since 1.0.0
 */
export interface RpcHandlers
  extends Record<string, RpcHandler.Any | { handlers: RpcHandlers }> {}

/**
 * @since 1.0.0
 */
export namespace RpcHandlers {
  /**
   * @category models
   * @since 1.0.0
   */
  export type FromService<S extends RpcService.DefinitionWithId> = {
    [K in Extract<keyof S, string>]: S[K] extends RpcService.DefinitionWithId
      ? { handlers: FromService<S[K]> }
      : S[K] extends RpcSchema.Any
      ? RpcHandler.FromSchema<S[K]>
      : never
  }

  /**
   * @category models
   * @since 1.0.0
   */
  export type Services<H extends RpcHandlers> = H[keyof H] extends RpcHandler<
    infer R,
    any,
    any,
    any
  >
    ? R
    : never

  /**
   * @category models
   * @since 1.0.0
   */
  export type Error<H extends RpcHandlers> = H[keyof H] extends RpcHandler<
    any,
    infer E,
    any,
    any
  >
    ? E
    : never

  /**
   * @category models
   * @since 1.0.0
   */
  export type Map<H extends RpcHandlers, P extends string = ""> = {
    [K in keyof H]: K extends string
      ? H[K] extends { handlers: RpcHandlers }
        ? Map<H[K]["handlers"], `${P}${K}.`>
        : H[K] extends RpcHandler.IO<infer R, infer E, infer _I, infer O>
        ? [`${P}${K}`, Effect.Effect<R, E, O>]
        : [`${P}${K}`, H[K]]
      : never
  }[keyof H]
}

/**
 * @category models
 * @since 1.0.0
 */
export interface RpcRouter<
  S extends RpcService.DefinitionWithId,
  H extends RpcHandlers.FromService<S>,
> extends RpcRouter.Base {
  readonly handlers: H
  readonly schema: S
  readonly undecoded: RpcUndecodedClient<H>
}

/**
 * @since 1.0.0
 */
export namespace RpcRouter {
  /**
   * @category models
   * @since 1.0.0
   */
  export interface Base {
    readonly handlers: RpcHandlers
    readonly schema: RpcService.DefinitionWithId
    readonly undecoded: RpcUndecodedClient<RpcHandlers>
  }
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const router = <
  S extends RpcService.DefinitionWithId,
  H extends RpcHandlers.FromService<S>,
>(
  schema: S,
  handlers: H,
): RpcRouter<S, H> => ({
  schema,
  handlers,
  undecoded: makeUndecodedClient(schema, handlers),
})

/**
 * @category constructors
 * @since 1.0.0
 */
export const handler = <R extends RpcRouter.Base>(
  router: R,
): ((
  u: unknown,
) => Effect.Effect<RpcHandlers.Services<R["handlers"]>, never, unknown>) => {
  const handler = handleSingleRequest(router)

  return (u) =>
    pipe(
      requestDecoder(u),
      Effect.orDie,
      Effect.flatMap((requests) => Effect.collectAllPar(requests.map(handler))),
      Effect.map(Chunk.toReadonlyArray),
    )
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const handlerRaw: <R extends RpcRouter.Base>(
  router: R,
) => <Req extends RpcRequestSchema.To<R["schema"]>>(
  request: Req,
) => Req extends { _tag: infer M }
  ? RpcHandler.FromMethod<M, R["handlers"]>
  : never = handleRequestUnion as any

/**
 * @category models
 * @since 1.0.0
 */
export interface UndecodedRpcResponse<M, O> {
  readonly __rpc: M
  readonly __output: O
}

/**
 * @category models
 * @since 1.0.0
 */
export type RpcUndecodedClient<H extends RpcHandlers, P extends string = ""> = {
  [K in Extract<keyof H, string>]: H[K] extends { handlers: RpcHandlers }
    ? RpcUndecodedClient<H[K]["handlers"], `${P}${K}.`>
    : H[K] extends RpcHandler.IO<infer R, infer E, infer I, infer O>
    ? (input: I) => Effect.Effect<R, E, UndecodedRpcResponse<`${P}${K}`, O>>
    : H[K] extends Effect.Effect<infer R, infer E, infer O>
    ? Effect.Effect<R, E, UndecodedRpcResponse<`${P}${K}`, O>>
    : never
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const makeUndecodedClient = <
  S extends RpcService.DefinitionWithId,
  H extends RpcHandlers.FromService<S>,
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

      const schema = schemas[method] as RpcSchema.Any

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
            (definition as RpcHandler.IO<any, any, any, any>)(input),
            Effect.flatMap(encodeEffect(schema.output)),
            Query.fromEffect,
          ),
      }
    },
    {} as any,
  )
