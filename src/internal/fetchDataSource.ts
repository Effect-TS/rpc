import * as Effect from "@effect/io/Effect"
import * as DataSource from "@effect/rpc/DataSource"
import type { RpcTransportError } from "@effect/rpc/Error"

/** @internal */
export const make = (options: DataSource.FetchDataSourceOptions) =>
  DataSource.make((requests) => send(requests, options))

const send = (
  requests: readonly DataSource.RpcRequest[],
  { url, headers = {} }: DataSource.FetchDataSourceOptions,
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
