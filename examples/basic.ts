import * as Effect from "@effect/io/Effect"
import * as Client from "@effect/rpc/Client"
import * as Server from "@effect/rpc/Server"
import * as RpcSchema from "@effect/rpc/Schema"
import * as Schema from "@effect/schema/Schema"
import { FetchDataSource } from "@effect/rpc/DataSource"

const posts = RpcSchema.make({
  create: {
    output: Schema.any,
  },
})

const postsRouter = Server.router(posts, {
  create: Effect.succeed({}),
})

const schema = RpcSchema.make({
  greet: {
    input: Schema.string,
    output: Schema.string,
    error: Schema.number,
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

const test = Server.handlerDirect(router)

const result = Effect.runSync(
  test({
    method: "greet",
    input: "John",
  }),
)
console.log(result)

const client = Client.make(
  schema,
  FetchDataSource.make({
    url: "http://localhost:3000",
  }),
)

const r = Effect.runSync(router.undecoded.posts.create)

client._unsafeDecode("posts.create", r)
