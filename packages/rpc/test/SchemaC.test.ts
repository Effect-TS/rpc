import * as Data from "@effect/data/Data"
import * as _ from "@effect/rpc/SchemaC"
import * as S from "@effect/schema/Schema"
import { describe, expect, it } from "vitest"

describe("SchemaC", () => {
  it("withConstructorSelf/ struct", () => {
    const User = _.withConstructorSelf(
      S.struct({
        name: S.string,
      }),
    )

    expect(User({ name: "John" })).toEqual({ name: "John" })
  })

  it("withConstructorTagged/", () => {
    const User = _.withConstructorTagged(
      S.struct({
        _tag: S.literal("User"),
        name: S.string,
      }),
      "User",
    )

    expect(User({ name: "John" })).toEqual({ _tag: "User", name: "John" })
  })

  it("withConstructorDataTagged/", () => {
    const User = _.withConstructorDataTagged(
      S.struct({
        _tag: S.literal("User"),
        name: S.string,
      }),
      "User",
    )

    expect(User({ name: "John" })).toEqual(
      Data.struct({ _tag: "User", name: "John" }),
    )
  })
})
