import { pipe } from "@effect/data/Function"
import * as Chunk from "@effect/data/Chunk"
import * as Effect from "@effect/io/Effect"
import * as Client from "@effect/rpc/Client"
import * as Server from "@effect/rpc/Server"
import * as RpcSchema from "@effect/rpc/Schema"
import * as Schema from "@effect/schema/Schema"
import { makeFetch } from "@effect/rpc/DataSource"

// Post schema
const PostId = pipe(
  Schema.number,
  Schema.positive(),
  Schema.int(),
  Schema.brand("PostId"),
)
type PostId = Schema.To<typeof PostId>

const Post = Schema.struct({
  id: PostId,
  body: Schema.string,
})
const CreatePost = pipe(Post, Schema.omit("id"))

// Post service schema
const posts = RpcSchema.make({
  create: {
    input: CreatePost,
    output: Post,
  },
  list: {
    output: Schema.chunk(Post),
  },
})

// Post service router
const postsRouter = Server.router(posts, {
  create: (post) =>
    Effect.succeed({
      ...post,
      id: PostId(1),
    }),

  list: Effect.succeed(
    Chunk.fromIterable([
      {
        id: PostId(1),
        body: "Hello world!",
      },
    ]),
  ),
})

// Root service schema
const schema = RpcSchema.make({
  // Add nested post service
  posts,

  greet: {
    input: Schema.string,
    output: Schema.string,
  },

  currentTime: {
    output: Schema.dateFromString(Schema.string),
  },
})

// Root service router
const router = Server.router(schema, {
  greet: (name) => Effect.succeed(`Hello ${name}!`),
  currentTime: Effect.sync(() => new Date()),
  posts: postsRouter,
})

// TODO: Connect router to HTTP server
export const handler = Server.handler(router)

// Create client
const client = Client.make(schema, makeFetch({ url: "http://localhost:3000" }))

Effect.runPromise(client.posts.create({ body: "Hello!" }))
