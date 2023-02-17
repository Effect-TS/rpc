import * as Effect from "@effect/io/Effect"
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
  Client.FetchDataSource.make({
    url: "http://localhost:3000",
  }),
)

client.greet("Tim")
