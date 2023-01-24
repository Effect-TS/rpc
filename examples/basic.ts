import { Effect } from "@effect/rpc/internal/common"
import * as Client from "@effect/rpc/client"
import * as Server from "@effect/rpc/server"
import * as Schema from "@fp-ts/schema/Schema"

export const schema = Server.schema({
  greet: {
    error: Schema.never,
    input: Schema.string,
    output: Schema.string,
  },
})

export const router = Server.router(schema, {
  greet: (name) => Effect.succeed(`Hello ${name}!`),
})

export const client = Client.make(
  schema,
  Client.FetchTransport.make({
    url: "http://localhost:3000",
  }),
)

client.greet("Tim")
