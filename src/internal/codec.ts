import * as Either from "@effect/data/Either"
import { flow, pipe } from "@effect/data/Function"
import * as Effect from "@effect/io/Effect"
import type { RpcDecodeFailure, RpcEncodeFailure } from "@effect/rpc/Error"
import type { ParseOptions } from "@effect/schema/AST"
import * as Schema from "@effect/schema/Schema"

/** @internal */
export const decode = <I, A>(schema: Schema.Schema<I, A>) => {
  const decode = Schema.parseEither(schema)
  return (input: unknown): Either.Either<RpcDecodeFailure, A> => {
    return pipe(
      decode(input),
      Either.mapLeft(
        (error): RpcDecodeFailure => ({
          _tag: "RpcDecodeFailure",
          errors: error.errors,
        }),
      ),
    )
  }
}

/** @internal */
export const decodeEffect = <I, A>(schema: Schema.Schema<I, A>) =>
  flow(decode(schema), Effect.fromEither)

/** @internal */
export const encode: <I, A>(
  schema: Schema.Schema<I, A>,
) => (
  input: A,
  options?: ParseOptions | undefined,
) => Either.Either<RpcEncodeFailure, I> = <I, A>(
  schema: Schema.Schema<I, A>,
) => {
  const encode = Schema.encodeEither(schema)

  return (input: A, options?: ParseOptions | undefined) =>
    pipe(
      encode(input, options),
      Either.mapLeft(
        (error): RpcEncodeFailure => ({
          _tag: "RpcEncodeFailure",
          errors: error.errors,
        }),
      ),
    )
}

/** @internal */
export const encodeEffect: <I, A>(
  schema: Schema.Schema<I, A>,
) => (
  input: A,
  options?: ParseOptions | undefined,
) => Effect.Effect<never, RpcEncodeFailure, I> = <I, A>(
  schema: Schema.Schema<I, A>,
) => {
  const encode = Schema.encodeEffect(schema)

  return (input: A, options?: ParseOptions | undefined) =>
    Effect.mapError(
      encode(input, options),
      (error): RpcEncodeFailure => ({
        _tag: "RpcEncodeFailure",
        errors: error.errors,
      }),
    )
}
