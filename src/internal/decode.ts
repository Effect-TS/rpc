import { RpcDecodeFailure, RpcEncodeFailure } from "../index.js"
import {
  Effect,
  Either,
  flow,
  ParseOptions,
  Parser,
  ParseResult,
  pipe,
  Schema,
} from "./common.js"
import * as ROA from "@effect/data/ReadonlyArray"

export const decode = <I, A>(schema: Schema.Schema<I, A>) => {
  const decode = Parser.decodeEither(schema)
  return (input: unknown): Either.Either<RpcDecodeFailure, A> => {
    return pipe(
      decode(input) as unknown as Either.Either<
        ROA.NonEmptyReadonlyArray<ParseResult.ParseError>,
        A
      >,
      Either.mapLeft(
        (errors): RpcDecodeFailure => ({
          _tag: "RpcDecodeFailure",
          errors,
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
      encode(input, options) as unknown as Either.Either<
        ROA.NonEmptyReadonlyArray<ParseResult.ParseError>,
        I
      >,
      Either.mapLeft(
        (errors): RpcEncodeFailure => ({
          _tag: "RpcEncodeFailure",
          errors,
        }),
      ),
    )
  }
}

export const encodeEffect = <A>(schema: Schema.Schema<A>) =>
  flow(encode(schema), Effect.fromEither)
