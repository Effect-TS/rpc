import * as Chunk from "@effect/data/Chunk"
import { pipe } from "@effect/data/Function"
import * as Effect from "@effect/io/Effect"
import * as DataSource from "@effect/query/DataSource"
import * as Request from "@effect/query/Request"
import * as dataSource from "@effect/rpc/DataSource"
import { RpcError, RpcTransportError } from "@effect/rpc/Error"
import { decodeEffect } from "@effect/rpc/internal/codec"
import * as Schema from "@effect/schema/Schema"

/** @internal */
export const RpcRequest = Request.of<dataSource.RpcRequest>()

/** @internal */
export const RpcResponse = Schema.either(
  RpcError,
  Schema.unknown,
) as any as Schema.Schema<dataSource.RpcResponse>

const responsesDecoder = decodeEffect(Schema.array(RpcResponse))

/** @internal */
export const make = <R>(
  send: (
    requests: readonly dataSource.RpcRequest[],
  ) => Effect.Effect<R, RpcTransportError, readonly unknown[]>,
): dataSource.RpcDataSource<R> =>
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
