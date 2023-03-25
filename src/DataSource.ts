import * as Chunk from "@effect/data/Chunk"
import * as Either from "@effect/data/Either"
import { pipe } from "@effect/data/Function"
import * as Effect from "@effect/io/Effect"
import * as DataSource from "@effect/query/DataSource"
import * as Request from "@effect/query/Request"
import { RpcError, RpcTransportError } from "@effect/rpc/Error"
import { decodeEffect } from "@effect/rpc/internal/decode"
import * as Schema from "@effect/schema/Schema"

export * as FetchDataSource from "@effect/rpc/internal/fetchDataSource"

export interface RpcDataSource<R>
  extends DataSource.DataSource<R, RpcRequest> {}

export interface RpcRequest extends Request.Request<RpcError, unknown> {
  readonly method: string
  readonly input: unknown
}
export const RpcRequest = Request.of<RpcRequest>()

export type RpcResponse = Either.Either<RpcError, unknown>
export const RpcResponse = Schema.either(
  RpcError,
  Schema.unknown,
) as any as Schema.Schema<RpcResponse>

const responsesDecoder = decodeEffect(Schema.array(RpcResponse))

export const make = <R>(
  send: (
    requests: readonly RpcRequest[],
  ) => Effect.Effect<R, RpcTransportError, readonly unknown[]>,
): RpcDataSource<R> =>
  DataSource.makeBatched("RpcDataSource", (requests) =>
    pipe(
      send(Chunk.toReadonlyArray(requests)),
      Effect.flatMap(responsesDecoder),
      Effect.flatMap((responses) =>
        Effect.collectAllParDiscard(
          Chunk.zipWith(
            requests,
            Chunk.fromIterable(responses),
            (request, response) => Request.complete(request, response),
          ),
        ),
      ),
      Effect.catchAll((_) =>
        Effect.collectAllDiscard(
          Chunk.map(requests, (request) => Request.fail(request, _)),
        ),
      ),
    ),
  )
