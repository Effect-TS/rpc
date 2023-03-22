import {
  Either,
  ParseResult,
  Request,
  ROA,
  Schema,
} from "@effect/rpc/internal/common"

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

export type RpcResponse = Either.Either<RpcError, unknown>
export const RpcResponse = Schema.either(
  RpcError,
  Schema.unknown,
) as any as Schema.Schema<RpcResponse>

// Codecs
export interface RpcSchemaNoInput<IE, E, IO, O> {
  output: Schema.Schema<IO, O>
  error: Schema.Schema<IE, E>
}

export interface RpcSchemaWithInput<IE, E, II, I, IO, O>
  extends RpcSchemaNoInput<IE, E, IO, O> {
  input: Schema.Schema<II, I>
}

export type RpcSchema<IE, E, II, I, IO, O> =
  | RpcSchemaNoInput<IE, E, IO, O>
  | RpcSchemaWithInput<IE, E, II, I, IO, O>

export type RpcSchemaAny =
  | RpcSchema<any, any, any, any, any, any>
  | RpcSchema<never, never, any, any, any, any>
  | RpcSchema<any, any, never, never, any, any>
  | RpcSchema<never, never, never, never, any, any>

export interface RpcSchemas extends Record<string, RpcSchemaAny> {}

export type ValidateSchemaInput<VL extends string, V, S extends RpcSchemas> = {
  [K in keyof S]: S[K] extends RpcSchemaNoInput<
    infer IE,
    infer _E,
    infer IO,
    infer _O
  >
    ? [IE | IO] extends [V]
      ? S[K]
      : `schema input does not extend ${VL}`
    : S[K] extends RpcSchemaWithInput<
        infer IE,
        infer _E,
        infer II,
        infer _I,
        infer IO,
        infer _O
      >
    ? [IE | IO | II] extends [V]
      ? S[K]
      : `schema input does not extend ${VL}`
    : never
} & {}

export const makeSchemaWith =
  <VL extends string, V>() =>
  <S extends RpcSchemas>(schema: S): ValidateSchemaInput<VL, V, S> =>
    schema as any

export const makeSchema = makeSchemaWith<"Schema.Json", Schema.Json>()
