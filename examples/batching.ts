import * as Effect from "@effect/io/Effect"
import * as Query from "@effect/query/Query"
import * as Client from "@effect/rpc/Client"
import { FetchDataSource } from "@effect/rpc/DataSource"
import * as RpcSchema from "@effect/rpc/Schema"
import * as Server from "@effect/rpc/Server"
import * as Schema from "@effect/schema/Schema"

export const schema = RpcSchema.make({
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
  FetchDataSource.make({
    url: "http://localhost:3000",
  }),
)

Query.flatMap(client.getIds, (ids) =>
  Query.collectAllPar(ids.map(client.getUser)),
)
