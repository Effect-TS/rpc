import * as Hash from "@effect/data/Hash"
import {
  RpcError,
  RpcRequest,
  RpcResponse,
  RpcSchemaAny,
  RpcSchemaNoInput,
  RpcSchemas,
  RpcSchemaWithInput,
} from "./index.js"
import {
  DataSource,
  Effect,
  Either,
  pipe,
  Query,
  Schema,
} from "./internal/common.js"
import { decode, encode } from "./internal/decode.js"
import type { UndecodedRpcResponse } from "./server.js"

export * as DataSource from "./internal/dataSource.js"
export * as FetchDataSource from "./internal/fetchDataSource.js"

export type Rpc<C extends RpcSchemaAny, TR> = C extends RpcSchemaWithInput<
  infer E,
  infer I,
  infer O
>
  ? (input: I) => Query.Query<TR, RpcError | E, O>
  : C extends RpcSchemaNoInput<infer E, infer O>
  ? Query.Query<TR, RpcError | E, O>
  : never

export type RpcClient<S extends RpcSchemas, TR> = {
  [K in keyof S]: Rpc<S[K], TR>
} & {
  _schemas: S
  _unsafeDecode: <M extends keyof S, O extends UndecodedRpcResponse<M>>(
    method: M,
    output: O,
  ) => S[M] extends { output: Schema.Schema<infer O> } ? O : never
}

export interface RpcDataSource<R>
  extends DataSource.DataSource<R, RpcRequest> {}

const responseDecoder = decode(RpcResponse)
const errorDecoder = decode(RpcError)

const unsafeDecode =
  <S extends RpcSchemas>(schemas: S) =>
  (method: keyof S, output: unknown) => {
    const a = decode(schemas[method].output)(output)
    if (a._tag !== "Left") {
      return a.right
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
  const send = (input: unknown) =>
    pipe(
      Query.fromRequest(RpcRequest({ method, input }), dataSource),
      Query.mapEffect((u) =>
        pipe(
          responseDecoder(u),
          Either.flatMap(
            Either.match(
              (e) =>
                pipe(
                  decode(schema.error as Schema.Schema<any>)(e),
                  Either.orElse(() => errorDecoder(e)),
                  Either.flatMap((e) => Either.left(e)),
                ),
              (_) => decode(schema.output as Schema.Schema<any>)(_),
            ),
          ),
          Either.match(
            (e) => Effect.fail(e),
            (a) => Effect.succeed(a),
          ),
        ),
      ),
    )

  if ("input" in schema) {
    return ((input: any) =>
      pipe(
        Query.fromEither(encode(schema.input as Schema.Schema<any>)(input)),
        Query.flatMap(send),
      )) as any
  }

  return send(null) as any
}
