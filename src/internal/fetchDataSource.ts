import * as Effect from "@effect/io/Effect"
import * as DataSource from "@effect/rpc/DataSource"
import { RpcTransportError } from "@effect/rpc/Error"

export interface FetchTransportOptions {
  readonly url: string
  readonly headers?: Record<string, string>
}

export const make = (options: FetchTransportOptions) =>
  DataSource.make((requests) => send(requests, options))

const send = (
  requests: readonly DataSource.RpcRequest[],
  { url, headers = {} }: FetchTransportOptions,
) =>
  Effect.attemptCatchPromiseInterrupt(
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
