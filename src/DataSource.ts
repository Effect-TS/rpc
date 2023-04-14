/**
 * @since 1.0.0
 */
import type * as Either from "@effect/data/Either"
import type * as Effect from "@effect/io/Effect"
import type * as DataSource from "@effect/query/DataSource"
import type * as Request from "@effect/query/Request"
import type { RpcError, RpcTransportError } from "@effect/rpc/Error"
import * as internal from "@effect/rpc/internal/dataSource"
import * as fetchDataSource from "@effect/rpc/internal/fetchDataSource"

/**
 * @category models
 * @since 1.0.0
 */
export interface RpcDataSource<R>
  extends DataSource.DataSource<R, RpcRequest> {}

/**
 * @category models
 * @since 1.0.0
 */
export interface RpcRequest extends Request.Request<RpcError, unknown> {
  readonly _tag: string
  readonly input?: unknown
}

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
) => RpcDataSource<R> = internal.make

/**
 * @category models
 * @since 1.0.0
 */
export interface FetchDataSourceOptions {
  readonly url: string
  readonly headers?: Record<string, string>
}

/**
 * @category constructors
 * @since 1.0.0
 */
export const makeFetch: (
  options: FetchDataSourceOptions,
) => RpcDataSource<never> = fetchDataSource.make
