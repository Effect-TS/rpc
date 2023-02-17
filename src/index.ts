import {
  Either,
  ParseResult,
  Request,
  ROA,
  Schema,
} from "@effect/rpc/internal/common"
import { either } from "./internal/either.js"

export interface RpcRequest extends Request.Request<RpcError, unknown> {
  readonly _tag: "RpcRequest"
  readonly method: string
  readonly input: unknown
}
export const RpcRequest = Request.tagged<RpcRequest>("RpcRequest")

export const RpcNotFound = Schema.struct({
  _tag: Schema.literal("RpcNotFound"),
  method: Schema.string,
})
export interface RpcNotFound extends Schema.Infer<typeof RpcNotFound> {}

export const RpcDecodeFailure = Schema.struct({
  _tag: Schema.literal("RpcDecodeFailure"),
  errors: Schema.nonEmptyArray(Schema.any),
})
export interface RpcDecodeFailure {
  readonly _tag: "RpcDecodeFailure"
  readonly errors: ROA.NonEmptyReadonlyArray<ParseResult.ParseError>
}

export const RpcTransportError = Schema.struct({
  _tag: Schema.literal("RpcTransportError"),
  error: Schema.unknown,
})
export interface RpcTransportError
  extends Schema.Infer<typeof RpcTransportError> {}

export interface RpcEncodeFailure {
  readonly _tag: "RpcEncodeFailure"
  readonly errors: ROA.NonEmptyReadonlyArray<ParseResult.ParseError>
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

export type RpcResponse = Either.Either<RpcError, unknown>
export const RpcResponse = either(
  RpcError,
  Schema.unknown,
) as Schema.Schema<RpcResponse>

// Codecs

export interface RpcSchemaNoInput<E, O> {
  output: Schema.Schema<O>
  error: Schema.Schema<E>
}

export interface RpcSchemaWithInput<E, I, O> extends RpcSchemaNoInput<E, O> {
  input: Schema.Schema<I>
}

export type RpcSchema<E, I, O> =
  | RpcSchemaNoInput<E, O>
  | RpcSchemaWithInput<E, I, O>

export type RpcSchemaAny =
  | RpcSchema<any, any, any>
  | RpcSchema<never, any, any>
  | RpcSchema<any, never, any>
  | RpcSchema<never, never, any>

export interface RpcSchemas extends Record<string, RpcSchemaAny> {}

export const makeSchema = <S extends RpcSchemas>(schema: S) => schema
