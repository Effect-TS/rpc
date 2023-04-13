/**
 * @since 1.0.0
 */
import type { Query } from "@effect/query/Query"
import type { RpcDataSource } from "@effect/rpc/DataSource"
import type { RpcError } from "@effect/rpc/Error"
import type { RpcSchema, RpcService } from "@effect/rpc/Schema"
import type { UndecodedRpcResponse } from "@effect/rpc/Server"
import * as internal from "@effect/rpc/internal/client"

/**
 * Represents an RPC method signature.
 *
 * @category models
 * @since 1.0.0
 */
export type Rpc<C extends RpcSchema.Any, TR> = C extends RpcSchema.IO<
  infer _IE,
  infer E,
  infer _II,
  infer I,
  infer _IO,
  infer O
>
  ? (input: I) => Query<TR, RpcError | E, O>
  : C extends RpcSchema.NoError<infer _II, infer I, infer _IO, infer O>
  ? (input: I) => Query<TR, RpcError, O>
  : C extends RpcSchema.NoInput<infer _IE, infer E, infer _IO, infer O>
  ? Query<TR, RpcError | E, O>
  : C extends RpcSchema.NoInputNoError<infer _IO, infer O>
  ? Query<TR, RpcError, O>
  : never

type RpcClientRpcs<S extends RpcService.DefinitionWithId, TR> = {
  [K in keyof S]: S[K] extends RpcService.DefinitionWithId
    ? RpcClientRpcs<S[K], TR>
    : S[K] extends RpcSchema.Any
    ? Rpc<S[K], TR>
    : never
}

/**
 * Represents an RPC client
 *
 * @category models
 * @since 1.0.0
 */
export type RpcClient<
  S extends RpcService.DefinitionWithId,
  TR,
> = RpcClientRpcs<S, TR> & {
  _schemas: S
  _unsafeDecode: <
    M extends RpcService.Methods<S>,
    O extends UndecodedRpcResponse<M, any>,
  >(
    method: M,
    output: O,
  ) => O extends UndecodedRpcResponse<M, infer O> ? O : never
}

/**
 * Creates an RPC client
 *
 * @category constructors
 * @since 1.0.0
 */
export const make: <
  S extends RpcService.DefinitionWithId,
  T extends RpcDataSource<any>,
>(
  schemas: S,
  transport: T,
) => RpcClient<S, T extends RpcDataSource<infer R> ? R : never> = internal.make
