/**
 * @since 1.0.0
 */
import type { Effect } from "effect/Effect"
import type { Option } from "effect/Option"
import type { Scope } from "effect/Scope"
import type { Span } from "effect/Tracer"
import type { RpcDecodeFailure, RpcEncodeFailure } from "./Error"
import * as internal from "./internal/server"
import type { DrainOuterGeneric } from "./internal/types"
import type { RpcResponse } from "./Resolver"
import type { RpcHandler, RpcHandlers, RpcRouter } from "./Router"
import type { RpcRequestSchema, RpcSchema, RpcService } from "./Schema"

/**
 * @category constructors
 * @since 1.0.0
 */
export const handler: {
  <const R extends RpcRouter.WithSetup>(
    router: R
  ): Effect<
    Scope,
    never,
    (
      request: unknown
    ) => Effect<
      Exclude<
        RpcHandlers.Services<R["handlers"]>,
        RpcRouter.SetupServices<R> | Span
      >,
      never,
      ReadonlyArray<RpcResponse>
    >
  >
  <const R extends RpcRouter.WithoutSetup>(
    router: R
  ): (
    request: unknown
  ) => Effect<
    Exclude<RpcHandlers.Services<R["handlers"]>, Span>,
    never,
    ReadonlyArray<RpcResponse>
  >
} = internal.handler as any

/**
 * @category constructors
 * @since 1.0.0
 */
export const handlerRaw: <const R extends RpcRouter.Base>(
  router: R
) => <Req extends RpcRequestSchema.To<R["schema"], "">>(
  request: Req
) => Req extends { _tag: infer M } ? RpcHandler.FromMethod<R["handlers"], M, Span, RpcEncodeFailure>
  : never = internal.handlerRaw as any

/**
 * @category constructors
 * @since 1.0.0
 */
export const handleSingle: {
  <const R extends RpcRouter.WithSetup>(
    router: R
  ): Effect<
    Scope,
    never,
    (
      request: unknown
    ) => Effect<
      Exclude<
        RpcHandlers.Services<R["handlers"]>,
        RpcRouter.SetupServices<R> | Span
      >,
      never,
      RpcResponse
    >
  >
  <R extends RpcRouter.WithoutSetup>(
    router: R
  ): (
    request: unknown
  ) => Effect<
    Exclude<RpcHandlers.Services<R["handlers"]>, Span>,
    never,
    RpcResponse
  >
} = internal.handleSingle as any

/**
 * @category constructors
 * @since 1.0.0
 */
export const handleSingleWithSchema: {
  <const R extends RpcRouter.WithSetup>(
    router: R
  ): Effect<
    Scope,
    never,
    (
      request: unknown
    ) => Effect<
      Exclude<
        RpcHandlers.Services<R["handlers"]>,
        RpcRouter.SetupServices<R> | Span
      >,
      never,
      readonly [RpcResponse, Option<RpcSchema.Base>]
    >
  >
  <R extends RpcRouter.WithoutSetup>(
    router: R
  ): (
    request: unknown
  ) => Effect<
    Exclude<RpcHandlers.Services<R["handlers"]>, Span>,
    never,
    readonly [RpcResponse, Option<RpcSchema.Base>]
  >
} = internal.handleSingleWithSchema as any

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
export type RpcUndecodedClient<H extends RpcHandlers, P extends string = ""> = DrainOuterGeneric<
  {
    readonly [K in Extract<keyof H, string>]: H[K] extends {
      readonly handlers: RpcHandlers
    } ? RpcUndecodedClient<H[K]["handlers"], `${P}${K}.`>
      : H[K] extends RpcHandler.IO<infer R, infer E, infer I, infer O> ? (
          input: I
        ) => Effect<
          Exclude<R, Span>,
          E | RpcEncodeFailure | RpcDecodeFailure,
          UndecodedRpcResponse<`${P}${K}`, O>
        >
      : H[K] extends Effect<infer R, infer E, infer O> ? Effect<
          Exclude<R, Span>,
          E | RpcEncodeFailure | RpcDecodeFailure,
          UndecodedRpcResponse<`${P}${K}`, O>
        >
      : never
  }
>

/**
 * @category constructors
 * @since 1.0.0
 */
export const makeUndecodedClient: <
  const S extends RpcService.DefinitionWithId,
  const H extends RpcHandlers.FromService<S>
>(
  schemas: S,
  handlers: H,
  options: RpcRouter.Options
) => RpcUndecodedClient<H> = internal.makeUndecodedClient

/**
 * @category utils
 * @since 1.0.0
 */
export interface RpcServer {
  (request: unknown): Effect<never, never, ReadonlyArray<RpcResponse>>
}

/**
 * @category utils
 * @since 1.0.0
 */
export interface RpcServerSingle {
  (request: unknown): Effect<never, never, RpcResponse>
}

/**
 * @category utils
 * @since 1.0.0
 */
export interface RpcServerSingleWithSchema {
  (
    request: unknown
  ): Effect<never, never, readonly [RpcResponse, Option<RpcSchema.Base>]>
}
