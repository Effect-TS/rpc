import { RpcRequest, RpcTransportError } from "../index.js"
import { Effect } from "./common.js"
import * as DataSource from "./dataSource.js"

export interface FetchTransportOptions {
  readonly url: string
  readonly headers?: Record<string, string>
}

export const make = (options: FetchTransportOptions) =>
  DataSource.make((requests) => send(requests, options))

const send = (
  requests: readonly RpcRequest[],
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
