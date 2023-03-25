import * as ROA from "@effect/data/ReadonlyArray"
import * as ParseResult from "@effect/schema/ParseResult"
import * as Schema from "@effect/schema/Schema"

export const RpcNotFound = Schema.struct({
  _tag: Schema.literal("RpcNotFound"),
  method: Schema.string,
})
export interface RpcNotFound extends Schema.To<typeof RpcNotFound> {}

export const RpcDecodeFailure = Schema.struct({
  _tag: Schema.literal("RpcDecodeFailure"),
  errors: Schema.nonEmptyArray(Schema.any),
})
export interface RpcDecodeFailure {
  readonly _tag: "RpcDecodeFailure"
  readonly errors: ROA.NonEmptyReadonlyArray<ParseResult.ParseErrors>
}

export const RpcTransportError = Schema.struct({
  _tag: Schema.literal("RpcTransportError"),
  error: Schema.unknown,
})
export interface RpcTransportError
  extends Schema.To<typeof RpcTransportError> {}

export interface RpcEncodeFailure {
  readonly _tag: "RpcEncodeFailure"
  readonly errors: ROA.NonEmptyReadonlyArray<ParseResult.ParseErrors>
}
export const RpcEncodeFailure = Schema.struct({
  _tag: Schema.literal("RpcEncodeFailure"),
  errors: Schema.nonEmptyArray(Schema.any),
})

export type RpcError =
  | RpcDecodeFailure
  | RpcEncodeFailure
  | RpcNotFound
  | RpcTransportError
export const RpcError = Schema.union(
  RpcDecodeFailure,
  RpcEncodeFailure,
  RpcNotFound,
  RpcTransportError,
)
