import {
  RpcError,
  RpcRequest,
  RpcSchemaAny,
  RpcSchemaNoInput,
  RpcSchemas,
  RpcSchema,
} from "./index.js"
import {
  DataSource,
  Effect,
  Either,
  pipe,
  Query,
  Schema,
} from "./internal/common.js"
import { decode, decodeEffect, encode } from "./internal/decode.js"
import type { UndecodedRpcResponse } from "./server.js"

export * as DataSource from "./internal/dataSource.js"
export * as FetchDataSource from "./internal/fetchDataSource.js"

export type Rpc<C extends RpcSchemaAny, TR> = C extends RpcSchema<
  infer _IE,
  infer E,
  infer _II,
  infer I,
  infer _IO,
  infer O
>
  ? (input: I) => Query.Query<TR, RpcError | E, O>
  : C extends RpcSchemaNoInput<infer _IE, infer E, infer _IO, infer O>
  ? Query.Query<TR, RpcError | E, O>
  : never

export type RpcClient<S extends RpcSchemas, TR> = {
  [K in keyof S]: Rpc<S[K], TR>
} & {
  _schemas: S
  _unsafeDecode: <M extends keyof S, O extends UndecodedRpcResponse<M>>(
    method: M,
    output: O,
  ) => S[M] extends { output: Schema.Schema<infer _IO, infer O> } ? O : never
}

export interface RpcDataSource<R>
  extends DataSource.DataSource<R, RpcRequest> {}

const unsafeDecode =
  <S extends RpcSchemas>(schemas: S) =>
  (method: keyof S, output: unknown) => {
    const result = decode(schemas[method].output)(output)
    if (result._tag !== "Left") {
      return result.right as unknown
    }

    throw "unsafeDecode fail"
  }

export const make = <S extends RpcSchemas, T extends RpcDataSource<any>>(
  schemas: S,
  transport: T,
) =>
  Object.entries(schemas).reduce<
    RpcClient<S, T extends RpcDataSource<infer R> ? R : never>
  >(
    (acc, [method, codec]) => ({
      ...acc,
      [method]: makeRpc(transport, codec, method),
    }),
    { _schemas: schemas, _unsafeDecode: unsafeDecode(schemas) } as any,
  )

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
