import { RpcDecodeFailure } from "../index.js"
import { Either, flow, Parser, Schema } from "./common.js"

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
