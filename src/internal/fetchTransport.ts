import { RpcClientTransport } from "../client.js"
import { Effect } from "./common.js"

export interface FetchTransportOptions {
  readonly url: string
  readonly headers?: Record<string, string>
}

export class FetchError {
  readonly _tag = "FetchError"
  constructor(readonly reason: unknown) {}
}

export const make = ({
  url,
  headers = {},
}: FetchTransportOptions): RpcClientTransport<never, FetchError> => ({
  send: (u) =>
    Effect.tryCatchPromiseInterrupt(
      (signal) =>
        fetch(url, {
          method: "POST",
          headers: {
            ...headers,
            "content-type": "application/json",
          },
          signal,
          body: JSON.stringify(u),
        }).then((r) => r.json()),
      (reason) => new FetchError(reason),
    ),
})
