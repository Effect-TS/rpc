import type { RpcHttpHandler } from "@effect/rpc-http/Server"
import { HttpRequest } from "@effect/rpc-http/Server"
import type { RpcRouter } from "@effect/rpc/Server"
import * as Server from "@effect/rpc/Server"
import * as Effect from "@effect/io/Effect"

/** @internal */
export function make<R extends RpcRouter.Base>(router: R): RpcHttpHandler<R> {
  const handler = Server.handler(router)
  return (request) =>
    Effect.provideService(handler(request.body), HttpRequest, request) as any
}
