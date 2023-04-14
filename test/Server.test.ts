import * as Effect from "@effect/io/Effect"
import * as Either from "@effect/data/Either"
import * as S from "@effect/schema/Schema"
import * as RS from "@effect/rpc/Schema"
import * as _ from "@effect/rpc/Server"
import { describe, it, expect } from "vitest"
import { pipe } from "@effect/data/Function"

const SomeError = S.struct({
  _tag: S.literal("SomeError"),
  message: S.string,
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

  encodeDate: {
    input: S.string,
    output: S.dateFromString(S.string),
    error: SomeError,
  },

  refined: {
    input: pipe(S.number, S.int(), S.greaterThan(10)),
    output: S.number,
  },
})

const router = _.router(schema, {
  greet: (name) => Effect.succeed(`Hello, ${name}!`),

  fail: (_) =>
    Effect.fail({
      _tag: "SomeError",
      message: "fail",
    }),

  failNoInput: Effect.fail({
    _tag: "SomeError",
    message: "fail",
  } as const),

  encodeInput: (date) => Effect.succeed(date),

  encodeDate: (dateString) =>
    Effect.tryCatch(
      () => new Date(dateString),
      () => ({
        _tag: "SomeError",
        message: "fail",
      }),
    ),

  refined: (n) => Effect.succeed(n),
})

const handler = _.handler(router)
const handlerRaw = _.handlerRaw(router)

describe("Server", () => {
  it("handler/", async () => {
    const date = new Date()
    const result = await Effect.runPromise(
      handler([
        { _tag: "greet", input: "John" },
        { _tag: "fail" },
        { _tag: "fail", input: "" },
        { _tag: "failNoInput" },
        { _tag: "encodeInput", input: date.toISOString() },
        { _tag: "encodeDate", input: date.toISOString() },
        { _tag: "refined", input: 5 },
        { _tag: "refined", input: 11 },
        // TODO: Enable once bug is fixed in schema
        // { _tag: "encodeDate", input: "test" },
      ]),
    )
    expect(result.length).toEqual(8)

    expect(result[0]).toEqual(Either.right("Hello, John!"))
    expect(result[1]._tag === "Left" && result[1].left._tag).toEqual(
      "RpcDecodeFailure",
    )
    expect(result[2]._tag === "Left" && result[2].left._tag).toEqual(
      "SomeError",
    )
    expect(result[3]._tag === "Left" && result[3].left._tag).toEqual(
      "SomeError",
    )
    expect(result[4]._tag === "Right" && result[4].right).toEqual(
      date.toISOString(),
    )
    expect(result[5]._tag === "Right" && result[5].right).toEqual(
      date.toISOString(),
    )
    expect(result[6]._tag === "Left" && result[6].left._tag).toEqual(
      "RpcDecodeFailure",
    )
    expect(result[7]._tag === "Right" && result[7].right).toEqual(11)
  })

  it("handlerRaw/", async () => {
    const date = new Date()
    const result = await Effect.runPromise(
      Effect.all([
        Effect.either(handlerRaw({ _tag: "greet", input: "John" })),
        Effect.either(handlerRaw({ _tag: "fail", input: "" })),
        Effect.either(handlerRaw({ _tag: "failNoInput" })),
        Effect.either(handlerRaw({ _tag: "encodeInput", input: date })),
        Effect.either(
          handlerRaw({ _tag: "encodeDate", input: date.toISOString() }),
        ),
        Effect.either(handlerRaw({ _tag: "refined", input: 5 })),
        Effect.either(handlerRaw({ _tag: "refined", input: 11 })),
        // TODO: Enable once bug is fixed in schema
        // { _tag: "encodeDate", input: "test" },
      ]),
    )
    expect(result.length).toEqual(7)

    expect(result[0]).toEqual(Either.right("Hello, John!"))
    expect(result[1]._tag === "Left" && result[1].left._tag).toEqual(
      "SomeError",
    )
    expect(result[2]._tag === "Left" && result[2].left._tag).toEqual(
      "SomeError",
    )
    expect(result[3]._tag === "Right" && result[3].right).toEqual(date)
    expect(result[4]._tag === "Right" && result[4].right).toEqual(date)
    expect(result[5]._tag === "Left" && result[5].left._tag).toEqual(
      "RpcEncodeFailure",
    )
    expect(result[6]._tag === "Right" && result[6].right).toEqual(11)
  })
})
