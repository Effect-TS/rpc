import {
  Either,
  ParseResult,
  ROA,
  Request,
  Schema,
} from "@effect/rpc/internal/common"
import { Simplify } from "@effect/rpc/internal/simplify"

export interface RpcRequest extends Request.Request<RpcError, unknown> {
  readonly method: string
  readonly input: unknown
}
export const RpcRequest = Request.of<RpcRequest>()

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
export interface RpcSchemaIO<IE, E, II, I, IO, O> {
  input: Schema.Schema<II, I>
  output: Schema.Schema<IO, O>
  error: Schema.Schema<IE, E>
}

export interface RpcSchemaNoError<II, I, IO, O> {
  input: Schema.Schema<II, I>
  output: Schema.Schema<IO, O>
}

export interface RpcSchemaNoInput<IE, E, IO, O> {
  output: Schema.Schema<IO, O>
  error: Schema.Schema<IE, E>
}

export interface RpcSchemaNoInputNoError<IO, O> {
  output: Schema.Schema<IO, O>
}

export type RpcSchemaAny =
  | RpcSchemaIO<any, any, any, any, any, any>
  | RpcSchemaNoError<any, any, any, any>
  | RpcSchemaNoInput<any, any, any, any>
  | RpcSchemaNoInputNoError<any, any>

export const RpcSchemaId = Symbol.for("@effect/rpc/RpcSchemaId")
export type RpcSchemaId = typeof RpcSchemaId

export interface RpcSchemaInput
  extends Record<string, RpcSchemaAny | RpcSchema<any>> {}

export interface RpcSchemas extends RpcSchemaInput {
  readonly [RpcSchemaId]: RpcSchemaId
}

export type RpcSchema<S extends RpcSchemaInput> = S & {
  readonly [RpcSchemaId]: RpcSchemaId
}

export type RpcSchemasMethods<S extends RpcSchemas, P extends string = ``> = {
  [M in keyof S]: M extends string
    ? S[M] extends RpcSchemas
      ? RpcSchemasMethods<S[M], `${P}${M}.`>
      : `${P}${M}`
    : never
}[keyof S]

export type ValidateSchemaInput<
  VL extends string,
  V,
  S extends RpcSchemaInput,
> = Simplify<{
  [K in keyof S]: S[K] extends RpcSchemas
    ? ValidateSchemaInput<VL, V, S[K]>
    : S[K] extends RpcSchemaIO<
        infer IE,
        infer _E,
        infer II,
        infer _I,
        infer IO,
        infer _O
      >
    ? [IE | II | IO] extends [V]
      ? S[K]
      : `schema input does not extend ${VL}`
    : S[K] extends RpcSchemaNoError<infer II, infer _I, infer IO, infer _O>
    ? [II | IO] extends [V]
      ? S[K]
      : `schema input does not extend ${VL}`
    : S[K] extends RpcSchemaNoInput<infer IE, infer _E, infer IO, infer _O>
    ? [IE | IO] extends [V]
      ? S[K]
      : `schema input does not extend ${VL}`
    : S[K] extends RpcSchemaNoInputNoError<infer IO, infer _O>
    ? [IO] extends [V]
      ? S[K]
      : `schema input does not extend ${VL}`
    : never
}>

export const makeSchemaWith =
  <VL extends string, V>() =>
  <S extends RpcSchemaInput>(schema: S): ValidateSchemaInput<VL, V, S> => ({
    ...(schema as any),
    [RpcSchemaId]: RpcSchemaId,
  })

export const makeSchema = makeSchemaWith<"Schema.Json", Schema.Json>()

export type RpcRequestInput<S extends RpcSchemaInput> = {
  [K in keyof S]: S[K] extends RpcSchemaIO<
    infer _IE,
    infer _E,
    infer II,
    infer _I,
    infer _IO,
    infer _O
  >
    ? { readonly method: K; readonly input: II }
    : S[K] extends RpcSchemaNoError<infer II, infer _I, infer _IO, infer _O>
    ? { readonly method: K; readonly input: II }
    : S[K] extends RpcSchemaNoInput<infer _IE, infer _E, infer _IO, infer _O>
    ? { readonly method: K }
    : S[K] extends RpcSchemaNoInputNoError<infer _IO, infer _O>
    ? { readonly method: K }
    : never
}[keyof S]

export type RpcRequestA<S extends RpcSchemaInput> = {
  [K in keyof S]: S[K] extends RpcSchemaIO<
    infer _IE,
    infer _E,
    infer _II,
    infer I,
    infer _IO,
    infer _O
  >
    ? { readonly method: K; readonly input: I }
    : S[K] extends RpcSchemaNoError<infer _II, infer I, infer _IO, infer _O>
    ? { readonly method: K; readonly input: I }
    : S[K] extends RpcSchemaNoInput<infer _IE, infer _E, infer _IO, infer _O>
    ? { readonly method: K }
    : S[K] extends RpcSchemaNoInputNoError<infer _IO, infer _O>
    ? { readonly method: K }
    : never
}[keyof S]

export type RpcRequestSchema<S extends RpcSchemaInput> = Schema.Schema<
  RpcRequestInput<S>,
  RpcRequestA<S>
> & {}

export const makeRequestSchema = <S extends RpcSchemaInput>(
  schema: S,
): RpcRequestSchema<S> =>
  Schema.union(
    ...Object.entries(schema).map(
      ([tag, schema]): Schema.Schema<any, any> =>
        "input" in schema
          ? Schema.struct({
              method: Schema.literal(tag),
              input: schema.input as Schema.Schema<any, any>,
            })
          : Schema.struct({ method: Schema.literal(tag) }),
    ),
  )

export const schemaMethodsMap = <S extends RpcSchemas>(
  schemas: S,
  prefix = "",
): Record<string, RpcSchemaAny> =>
  Object.entries(schemas).reduce((acc, [method, schema]) => {
    if (RpcSchemaId in schema) {
      return {
        ...acc,
        ...schemaMethodsMap(schema, `${prefix}${method}.`),
      }
    }
    return { ...acc, [`${prefix}${method}`]: schema }
  }, {})
