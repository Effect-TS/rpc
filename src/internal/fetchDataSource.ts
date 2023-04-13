import * as Effect from "@effect/io/Effect"
import type { FetchDataSourceOptions, RpcRequest } from "@effect/rpc/DataSource"
import type { RpcTransportError } from "@effect/rpc/Error"
import * as dataSource from "@effect/rpc/internal/dataSource"

/** @internal */
export const make = (options: FetchDataSourceOptions) =>
  dataSource.make((requests) => send(requests, options))

const send = (
  requests: ReadonlyArray<RpcRequest>,
  { headers = {}, url }: FetchDataSourceOptions,
) =>
  Effect.tryCatchPromiseInterrupt(
    (signal) =>
      fetch(url, {
        method: "POST",
        headers: {
          ...headers,
          "content-type": "application/json",
        },
        signal,
        body: JSON.stringify(requests),
      }).then((r) => r.json()),
    (error): RpcTransportError => ({
      _tag: "RpcTransportError",
      error,
    }),
  )
