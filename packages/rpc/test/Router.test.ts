import { Tag } from "@effect/data/Context"
import * as Effect from "@effect/io/Effect"
import * as _ from "@effect/rpc/Router"
import * as RS from "@effect/rpc/Schema"
import * as S from "@effect/schema/Schema"
import { describe, expectTypeOf, it } from "vitest"

const makeCounter = () => {
  let count = 0

  return {
    count: () => count++,
  }
}
interface Counter extends ReturnType<typeof makeCounter> {}
const Counter = Tag<Counter>()

const schema = RS.make({
  getCount: {
    output: S.tuple(S.number, S.number),
  },
})

const router = _.make(schema, {
  getCount: Effect.map(
    Counter,
    (counter) => [counter.count(), counter.count()] as const,
  ),
})

describe("Router", () => {
  it("provideServiceSync/", () => {
    expectTypeOf(router.handlers.getCount).toMatchTypeOf<
      Effect.Effect<Counter, never, readonly [number, number]>
    >()

    const provided = _.provideServiceSync(router, Counter, makeCounter)
    expectTypeOf(provided.handlers.getCount).toMatchTypeOf<
      Effect.Effect<never, never, readonly [number, number]>
    >()

    expect(Effect.runSync(provided.handlers.getCount)).toEqual([0, 1])
  })
})
