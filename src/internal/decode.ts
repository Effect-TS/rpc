import { RpcDecodeFailure, RpcEncodeFailure } from "../index.js"
import { Effect, Either, flow, ParseOptions, Parser, Schema } from "./common.js"

export const decode = <A>(schema: Schema.Schema<A>) =>
  flow(
    Parser.decode(schema),
    Either.mapLeft(
      (errors): RpcDecodeFailure => ({
        _tag: "RpcDecodeFailure",
        errors,
      }),
    ),
  )

export const decodeEffect = <A>(schema: Schema.Schema<A>) =>
  flow(decode(schema), Effect.fromEither)

export const encode: <A>(
  schema: Schema.Schema<A>,
) => (
  a: A,
  options?: ParseOptions | undefined,
) => Either.Either<RpcEncodeFailure, unknown> = <A>(schema: Schema.Schema<A>) =>
  flow(
    Parser.encode(schema),
    Either.mapLeft(
      (errors): RpcEncodeFailure => ({
        _tag: "RpcEncodeFailure",
        errors,
      }),
    ),
  )

export const encodeEffect = <A>(schema: Schema.Schema<A>) =>
  flow(encode(schema), Effect.fromEither)
