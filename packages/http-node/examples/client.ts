import * as Http from "@effect/platform/HttpClient"
import * as Client from "@effect/rpc-http-node/Client"
import { schema } from "@effect/rpc-http-node/examples/schema"
import * as Effect from "effect/Effect"
import { pipe } from "effect/Function"

// Create the client
const client = Client.make(
  schema,
  Http.client.fetch().pipe(
    Http.client.mapRequest(Http.request.prependUrl("http://localhost:3000"))
  )
)

// Use the client
pipe(
  client.getUserIds,
  Effect.flatMap((ids) => Effect.forEach(ids, client.getUser, { concurrency: "unbounded" })),
  Effect.tap((users) =>
    Effect.sync(() => {
      console.log(users)
    })
  ),
  Effect.runFork
)
