import { RpcDecodeFailure, RpcEncodeFailure } from "../index.js"
import {
  Effect,
  Either,
  ParseOptions,
  Parser,
  Schema,
  flow,
  pipe,
} from "./common.js"

export const decode = <I, A>(schema: Schema.Schema<I, A>) => {
  const decode = Parser.parseEither(schema)
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

export const decodeEffect = <A>(schema: Schema.Schema<A>) =>
  flow(decode(schema), Effect.fromEither)

export const encode: <I, A>(
  schema: Schema.Schema<I, A>,
) => (
  input: A,
  options?: ParseOptions | undefined,
) => Either.Either<RpcEncodeFailure, I> = <I, A>(
  schema: Schema.Schema<I, A>,
) => {
  const encode = Parser.encodeEither(schema)

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

export const encodeEffect = <A>(schema: Schema.Schema<A>) =>
  flow(encode(schema), Effect.fromEither)
