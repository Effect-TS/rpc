import {
  RpcError,
  RpcRequest,
  RpcSchemaAny,
  RpcSchemaNoInput,
  RpcSchemas,
  RpcSchemaIO,
  RpcSchemaNoError,
  RpcSchemaNoInputNoError,
  RpcSchemasMethods,
  schemaMethodsMap,
  RpcSchemasId,
} from "./index.js"
import { DataSource, Effect, pipe, Query, Schema } from "./internal/common.js"
import { decode, decodeEffect, encode } from "./internal/decode.js"
import type { UndecodedRpcResponse } from "./server.js"

export * as DataSource from "./internal/dataSource.js"
export * as FetchDataSource from "./internal/fetchDataSource.js"

export type Rpc<C extends RpcSchemaAny, TR> = C extends RpcSchemaIO<
  infer _IE,
  infer E,
  infer _II,
  infer I,
  infer _IO,
  infer O
>
  ? (input: I) => Query.Query<TR, RpcError | E, O>
  : C extends RpcSchemaNoError<infer _II, infer I, infer _IO, infer O>
  ? (input: I) => Query.Query<TR, RpcError, O>
  : C extends RpcSchemaNoInput<infer _IE, infer E, infer _IO, infer O>
  ? Query.Query<TR, RpcError | E, O>
  : C extends RpcSchemaNoInputNoError<infer _IO, infer O>
  ? Query.Query<TR, RpcError, O>
  : never

type RpcClientRpcs<S extends RpcSchemas, TR> = {
  [K in keyof S]: S[K] extends RpcSchemas
    ? RpcClientRpcs<S[K], TR>
    : S[K] extends RpcSchemaAny
    ? Rpc<S[K], TR>
    : never
}

export type RpcClient<S extends RpcSchemas, TR> = RpcClientRpcs<S, TR> & {
  _schemas: S
  _unsafeDecode: <
    M extends RpcSchemasMethods<S>,
    O extends UndecodedRpcResponse<M, any>,
  >(
    method: M,
    output: O,
  ) => O extends UndecodedRpcResponse<M, infer O> ? O : never
}

export interface RpcDataSource<R>
  extends DataSource.DataSource<R, RpcRequest> {}

const unsafeDecode = <S extends RpcSchemas>(schemas: S) => {
  const map = schemaMethodsMap(schemas)
  return (method: RpcSchemasMethods<S>, output: unknown) => {
    const result = decode(map[method as string].output)(output)
    if (result._tag !== "Left") {
      return result.right as unknown
    }

    throw "unsafeDecode fail"
  }
}

const makeRecursive = <S extends RpcSchemas, T extends RpcDataSource<any>>(
  schemas: S,
  transport: T,
  prefix = "",
): RpcClient<S, T extends RpcDataSource<infer R> ? R : never> =>
  Object.entries(schemas).reduce(
    (acc, [method, codec]) => ({
      ...acc,
      [method]:
        RpcSchemasId in codec
          ? makeRecursive(codec, transport, `${prefix}${method}.`)
          : makeRpc(transport, codec, `${prefix}${method}`),
    }),
    {} as any,
  )

export const make = <S extends RpcSchemas, T extends RpcDataSource<any>>(
  schemas: S,
  transport: T,
): RpcClient<S, T extends RpcDataSource<infer R> ? R : never> =>
  ({
    ...makeRecursive(schemas, transport),
    _schemas: schemas,
    _unsafeDecode: unsafeDecode(schemas),
  } as any)

const makeRpc = <S extends RpcSchemaAny, TR>(
  dataSource: RpcDataSource<TR>,
  schema: S,
  method: string,
): Rpc<S, TR> => {
  const responseSchema = Schema.either(
    "error" in schema ? Schema.union(RpcError, schema.error) : RpcError,
    schema.output,
  )
  const parseResponse = decodeEffect(responseSchema)

  const send = (input: unknown) =>
    pipe(
      Query.fromRequest(RpcRequest({ method, input }), dataSource),
      Query.mapEffect((u) =>
        Effect.flatMap(parseResponse(u), Effect.fromEither),
      ),
    )

  if ("input" in schema) {
    const encodeInput = encode(schema.input as Schema.Schema<any>)
    return ((input: any) =>
      pipe(Query.fromEither(encodeInput(input)), Query.flatMap(send))) as any
  }

  return send(undefined) as any
}
