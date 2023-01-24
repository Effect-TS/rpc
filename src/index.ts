import { Either, ParseError, ROA, Schema } from "@effect/rpc/internal/common"
import { either } from "./internal/either.js"

export const RpcRequest = Schema.struct({
  method: Schema.string,
  input: Schema.unknown,
})
export type RpcRequest = Schema.Infer<typeof RpcRequest>

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
  readonly errors: ROA.NonEmptyReadonlyArray<ParseError.ParseError>
}

export type RpcServerError = RpcDecodeFailure | RpcNotFound
export const RpcServerError = Schema.union(RpcDecodeFailure, RpcNotFound)

export const RpcResponse = either(Schema.unknown, Schema.unknown)
export type RpcResponse = Schema.Infer<typeof RpcResponse>

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
  | RpcSchema<any, any, never>

export interface RpcSchemas
  extends Record<
    string,
    | RpcSchema<any, any, any>
    | RpcSchema<never, any, any>
    | RpcSchema<any, never, any>
  > {}

export const makeSchema = <S extends RpcSchemas>(schema: S) => schema
