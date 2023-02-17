import { RpcDataSource } from "../client.js"
import { RpcRequest, RpcResponse, RpcTransportError } from "../index.js"
import { Chunk, DataSource, Effect, pipe, Request, Schema } from "./common.js"
import { decodeEffect } from "./decode.js"

const responsesDecoder = decodeEffect(Schema.array(RpcResponse))

export const make = <R>(
  send: (
    requests: readonly RpcRequest[],
  ) => Effect.Effect<R, RpcTransportError, readonly unknown[]>,
): RpcDataSource<R> =>
  DataSource.makeBatched("RpcDataSource", (requests) =>
    pipe(
      send(requests.toReadonlyArray()),
      Effect.flatMap((_) => responsesDecoder(_)),
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
          requests.map((request) => Request.fail(request, _)),
        ),
      ),
    ),
  )
