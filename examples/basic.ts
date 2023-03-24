import * as Effect from "@effect/io/Effect"
import * as Client from "@effect/rpc/client"
import * as Server from "@effect/rpc/server"
import * as Schema from "@effect/schema/Schema"
import { RpcSchemaId } from "@effect/rpc"

const posts = Server.schema({
  create: {
    output: Schema.any,
  },
})

const postsRouter = Server.router(posts, {
  create: Effect.succeed({}),
})

const schema = Server.schema({
  greet: {
    input: Schema.string,
    output: Schema.string,
  },

  currentTime: {
    output: Schema.dateFromString,
  },

  posts,
})

const router = Server.router(schema, {
  greet: (name) => Effect.succeed(`Hello ${name}!`),
  currentTime: Effect.sync(() => new Date()),
  posts: postsRouter,
})

const client = Client.make(
  schema,
  Client.FetchDataSource.make({
    url: "http://localhost:3000",
  }),
)

const r = Effect.runSync(router.undecoded.posts.create)

client._unsafeDecode("posts.create", r)
