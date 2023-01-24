import { IdentifierId } from "@fp-ts/schema/annotation/AST"
import * as H from "@fp-ts/schema/annotation/Hook"
import * as Pretty from "@fp-ts/schema/Pretty"
import { Either, Schema } from "./common.js"

const inline = <E, A>(
  left: Schema.Schema<E>,
  right: Schema.Schema<A>,
): Schema.Schema<Either.Either<E, A>> =>
  Schema.union(
    Schema.struct({ _tag: Schema.literal("Left"), left }),
    Schema.struct({ _tag: Schema.literal("Right"), right }),
  )

const pretty = <E, A>(
  left: Pretty.Pretty<E>,
  right: Pretty.Pretty<A>,
): Pretty.Pretty<Either.Either<E, A>> =>
  Pretty.make(
    either(left, right),
    Either.match(
      (e) => `left(${left.pretty(e)})`,
      (a) => `right(${right.pretty(a)})`,
    ),
  )

export const either = <E, A>(
  left: Schema.Schema<E>,
  right: Schema.Schema<A>,
): Schema.Schema<Either.Either<E, A>> =>
  Schema.typeAlias([left, right], inline(left, right), {
    [IdentifierId]: "Either",
    [H.PrettyHookId]: H.hook(pretty),
  })
