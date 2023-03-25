import type { SimplifySchema } from "@effect/rpc/internal/schema"
import * as Schema from "@effect/schema/Schema"

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
> = SimplifySchema<{
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

export const makeWith =
  <VL extends string, V>() =>
  <S extends RpcSchemaInput>(schema: S): ValidateSchemaInput<VL, V, S> => ({
    ...(schema as any),
    [RpcSchemaId]: RpcSchemaId,
  })

export const make = makeWith<"Schema.Json", Schema.Json>()

export type RpcRequestInput<S extends RpcSchemaInput, P extends string = ""> = {
  [K in keyof S]: K extends string
    ? S[K] extends RpcSchemas
      ? RpcRequestA<S[K], `${P}${K}.`>
      : S[K] extends RpcSchemaIO<
          infer _IE,
          infer _E,
          infer II,
          infer _I,
          infer _IO,
          infer _O
        >
      ? { readonly method: `${P}${K}`; readonly input: II }
      : S[K] extends RpcSchemaNoError<infer II, infer _I, infer _IO, infer _O>
      ? { readonly method: `${P}${K}`; readonly input: II }
      : S[K] extends RpcSchemaNoInput<infer _IE, infer _E, infer _IO, infer _O>
      ? { readonly method: `${P}${K}` }
      : S[K] extends RpcSchemaNoInputNoError<infer _IO, infer _O>
      ? { readonly method: `${P}${K}` }
      : never
    : never
}[keyof S]

export type RpcRequestA<S extends RpcSchemaInput, P extends string = ""> = {
  [K in keyof S]: K extends string
    ? S[K] extends RpcSchemas
      ? RpcRequestA<S[K], `${P}${K}.`>
      : S[K] extends RpcSchemaIO<
          infer _IE,
          infer _E,
          infer _II,
          infer I,
          infer _IO,
          infer _O
        >
      ? { readonly method: `${P}${K}`; readonly input: I }
      : S[K] extends RpcSchemaNoError<infer _II, infer I, infer _IO, infer _O>
      ? { readonly method: `${P}${K}`; readonly input: I }
      : S[K] extends RpcSchemaNoInput<infer _IE, infer _E, infer _IO, infer _O>
      ? { readonly method: `${P}${K}` }
      : S[K] extends RpcSchemaNoInputNoError<infer _IO, infer _O>
      ? { readonly method: `${P}${K}` }
      : never
    : never
}[keyof S]

export type RpcRequestSchema<S extends RpcSchemaInput> = Schema.Schema<
  RpcRequestInput<S>,
  RpcRequestA<S>
> & {}

export const makeRequestUnion = <S extends RpcSchemaInput>(
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
