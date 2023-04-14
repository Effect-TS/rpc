import * as Chunk from "@effect/data/Chunk"
import { isEither } from "@effect/data/Either"
import { pipe } from "@effect/data/Function"
import * as Effect from "@effect/io/Effect"
import * as DataSource from "@effect/query/DataSource"
import * as Request from "@effect/query/Request"
import type * as dataSource from "@effect/rpc/DataSource"
import type { RpcDecodeFailure, RpcTransportError } from "@effect/rpc/Error"
import * as PR from "@effect/schema/ParseResult"

/** @internal */
export const RpcRequest = Request.of<dataSource.RpcRequest>()

/** @internal */
export const make = <R>(
  send: (
    requests: ReadonlyArray<dataSource.RpcRequest>,
  ) => Effect.Effect<R, RpcTransportError, ReadonlyArray<unknown>>,
): dataSource.RpcDataSource<R> =>
  DataSource.makeBatched("RpcDataSource", (requests) =>
    pipe(
      send(Chunk.toReadonlyArray(requests)),
      Effect.filterOrFail(
        (_): _ is ReadonlyArray<dataSource.RpcResponse> =>
          Array.isArray(_) && _.length === requests.length && isEither(_[0]),
        (): RpcDecodeFailure => ({
          _tag: "RpcDecodeFailure",
          errors: [PR.unexpected(requests)],
        }),
      ),
      Effect.flatMap((responses) =>
        Effect.collectAllParDiscard(
          Chunk.zipWith(
            requests,
            Chunk.fromIterable(responses),
            (request, response) =>
              Request.complete(request, response as dataSource.RpcResponse),
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
