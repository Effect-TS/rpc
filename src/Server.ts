/**
 * @since 1.0.0
 */
import type { Effect } from "@effect/io/Effect"
import type { RpcResponse } from "@effect/rpc/DataSource"
import type { RpcDecodeFailure, RpcEncodeFailure } from "@effect/rpc/Error"
import type {
  RpcRequestSchema,
  RpcSchema,
  RpcService,
} from "@effect/rpc/Schema"
import * as internal from "@effect/rpc/internal/server"

/**
 * @category models
 * @since 1.0.0
 */
export type RpcHandler<R, E, I, O> = RpcHandler.IO<R, E, I, O> | Effect<R, E, O>

/**
 * @since 1.0.0
 */
export namespace RpcHandler {
  /**
   * @category models
   * @since 1.0.0
   */
  export type IO<R, E, I, O> = (input: I) => Effect<R, E, O>

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
    ? Effect<any, E, O>
    : C extends RpcSchema.NoInputNoError<infer _IO, infer O>
    ? Effect<any, never, O>
    : never

  /**
   * @category models
   * @since 1.0.0
   */
  export type FromMethod<M, H extends RpcHandlers, XE> = Extract<
    RpcHandlers.Map<H, XE>,
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
  export type Map<H extends RpcHandlers, XE, P extends string = ""> = {
    [K in keyof H]: K extends string
      ? H[K] extends { handlers: RpcHandlers }
        ? Map<H[K]["handlers"], XE, `${P}${K}.`>
        : H[K] extends RpcHandler.IO<infer R, infer E, infer _I, infer O>
        ? [`${P}${K}`, Effect<R, E | XE, O>]
        : H[K] extends Effect<infer R, infer E, infer O>
        ? [`${P}${K}`, Effect<R, E | XE, O>]
        : never
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
export const router: <
  S extends RpcService.DefinitionWithId,
  H extends RpcHandlers.FromService<S>,
>(
  schema: S,
  handlers: H,
) => RpcRouter<S, H> = internal.router

/**
 * @category constructors
 * @since 1.0.0
 */
export const handler: <R extends RpcRouter.Base>(
  router: R,
) => (
  requests: unknown,
) => Effect<
  RpcHandlers.Services<R["handlers"]>,
  never,
  ReadonlyArray<RpcResponse>
> = internal.handler

/**
 * @category constructors
 * @since 1.0.0
 */
export const handlerRaw: <R extends RpcRouter.Base>(
  router: R,
) => <Req extends RpcRequestSchema.To<R["schema"], "">>(
  request: Req,
) => Req extends { _tag: infer M }
  ? RpcHandler.FromMethod<M, R["handlers"], RpcEncodeFailure>
  : never = internal.handlerRaw as any

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
    ? (
        input: I,
      ) => Effect<
        R,
        E | RpcEncodeFailure | RpcDecodeFailure,
        UndecodedRpcResponse<`${P}${K}`, O>
      >
    : H[K] extends Effect<infer R, infer E, infer O>
    ? Effect<
        R,
        E | RpcEncodeFailure | RpcDecodeFailure,
        UndecodedRpcResponse<`${P}${K}`, O>
      >
    : never
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const makeUndecodedClient: <
  S extends RpcService.DefinitionWithId,
  H extends RpcHandlers.FromService<S>,
>(
  schemas: S,
  handlers: H,
) => RpcUndecodedClient<H> = internal.makeUndecodedClient