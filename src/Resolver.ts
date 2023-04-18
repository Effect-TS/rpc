/**
 * @since 1.0.0
 */
import type * as Either from "@effect/data/Either"
import type * as Effect from "@effect/io/Effect"
import type * as Request from "@effect/io/Request"
import type * as Resolver from "@effect/io/RequestResolver"
import type { RpcError, RpcTransportError } from "@effect/rpc/Error"
import * as internal from "@effect/rpc/internal/resolver"

/**
 * @category models
 * @since 1.0.0
 */
export interface RpcResolver<R>
  extends Resolver.RequestResolver<R, RpcRequest> {}

/**
 * @category models
 * @since 1.0.0
 */
export interface RpcRequestFields {
  readonly _tag: string
  readonly input?: unknown
  readonly spanName: string
  readonly traceId: string
  readonly spanId: string
}

/**
 * @category models
 * @since 1.0.0
 */
export interface RpcRequest
  extends Request.Request<RpcError, unknown>,
    RpcRequestFields {}

/**
 * @category models
 * @since 1.0.0
 */
export type RpcResponse = Either.Either<RpcError, unknown>

/**
 * @category constructors
 * @since 1.0.0
 */
export const make: <R>(
  send: (
    requests: ReadonlyArray<RpcRequest>,
  ) => Effect.Effect<R, RpcTransportError, ReadonlyArray<unknown>>,
) => RpcResolver<R> = internal.make
