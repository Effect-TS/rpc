import * as Either from "@effect/data/Either"
import { flow, pipe } from "@effect/data/Function"
import * as Effect from "@effect/io/Effect"
import { RpcDecodeFailure, RpcEncodeFailure } from "@effect/rpc/Error"
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

  return (input: A, options?: ParseOptions | undefined) => {
    return pipe(
      encode(input, options),
      Either.mapLeft(
        (error): RpcEncodeFailure => ({
          _tag: "RpcEncodeFailure",
          errors: error.errors,
        }),
      ),
    )
  }
}

/** @internal */
export const encodeEffect = <A>(schema: Schema.Schema<A>) =>
  flow(encode(schema), Effect.fromEither)

/** @internal */
export const requestDecoder = decodeEffect(
  Schema.array(
    Schema.struct({
      _tag: Schema.string,
      input: Schema.unknown,
    }),
  ),
)
