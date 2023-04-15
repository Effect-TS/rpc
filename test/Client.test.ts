import * as Effect from "@effect/io/Effect"
import * as S from "@effect/schema/Schema"
import * as RS from "@effect/rpc/Schema"
import * as Server from "@effect/rpc/Server"
import * as _ from "@effect/rpc/Client"
import * as DataSource from "@effect/rpc/DataSource"
import { describe, it, expect } from "vitest"

const SomeError = S.struct({
  _tag: S.literal("SomeError"),
  message: S.string,
})

const posts = RS.make({
  create: {
    input: S.struct({ body: S.string }),
    output: S.struct({ id: S.number, body: S.string }),
  },
})

const schema = RS.make({
  greet: {
    input: S.string,
    output: S.string,
    error: S.never,
  },

  fail: {
    input: S.string,
    output: S.string,
    error: SomeError,
  },

  failNoInput: {
    output: S.string,
    error: SomeError,
  },

  encodeInput: {
    input: S.dateFromString(S.string),
    output: S.dateFromString(S.string),
  },

  posts,
})

const router = Server.router(schema, {
  greet: (name) => Effect.succeed(`Hello, ${name}!`),
  fail: (message) => Effect.fail({ _tag: "SomeError", message }),
  failNoInput: Effect.fail({ _tag: "SomeError", message: "fail" } as const),
  encodeInput: (date) => Effect.succeed(date),
  posts: Server.router(posts, {
    create: (post) =>
      Effect.succeed({
        id: 1,
        body: post.body,
      }),
  }),
})

const handler = Server.handler(router)
const client = _.make(schema, DataSource.make(handler))

describe("Client", () => {
  it("encoded/", async () => {
    expect(await Effect.runPromise(client.greet("John"))).toEqual(
      "Hello, John!",
    )

    expect(
      await Effect.runPromise(Effect.flip(client.fail("message"))),
    ).toEqual({ _tag: "SomeError", message: "message" })

    expect(await Effect.runPromise(Effect.flip(client.failNoInput))).toEqual({
      _tag: "SomeError",
      message: "fail",
    })

    const date = new Date()
    expect(await Effect.runPromise(client.encodeInput(date))).toEqual(date)
  })

  it("encoded/ nested", async () => {
    expect(
      await Effect.runPromise(client.posts.create({ body: "hello" })),
    ).toEqual({ id: 1, body: "hello" })
  })
})
