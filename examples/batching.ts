import * as Effect from "@effect/io/Effect"
import * as Query from "@effect/query/Query"
import * as Client from "@effect/rpc/client"
import * as Server from "@effect/rpc/server"
import * as Schema from "@effect/schema/Schema"

export const schema = Server.schema({
  getIds: {
    output: Schema.array(Schema.string),
  },
  getUser: {
    input: Schema.string,
    output: Schema.any,
  },
})

export const router = Server.router(schema, {
  getIds: Effect.succeed(["1", "2", "3"]),
  getUser: (id) => Effect.succeed({ id, name: "Tim" }),
})

export const client = Client.make(
  schema,
  Client.FetchDataSource.make({
    url: "http://localhost:3000",
  }),
)

Query.flatMap(client.getIds, (ids) =>
  Query.collectAllPar(ids.map(client.getUser)),
)
