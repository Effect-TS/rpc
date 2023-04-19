import { pipe } from "@effect/data/Function"
import * as RpcHttp from "@effect/rpc-http"
import * as Effect from "@effect/io/Effect"
import { schema } from "@effect/rpc-http/examples/schema"
import * as Client from "@effect/rpc/Client"

// Create the client
const client = Client.make(
  schema,
  RpcHttp.resolver.make({
    url: "http://localhost:3000",
  }),
)

// Use the client
pipe(
  client.getUserIds,
  Effect.flatMap((ids) => Effect.forEachPar(ids, client.getUser)),
  Effect.tap((users) =>
    Effect.sync(() => {
      console.log(users)
    }),
  ),
  Effect.withRequestBatching("on"),
  Effect.runFork,
)
