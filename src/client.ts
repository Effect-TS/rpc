import * as Hash from "@fp-ts/data/Hash"
import {
  RpcDecodeFailure,
  RpcRequest,
  RpcResponse,
  RpcSchemaAny,
  RpcSchemaNoInput,
  RpcSchemas,
  RpcSchemaWithInput,
  RpcServerError,
} from "./index.js"
import { Effect, Either, Parser, pipe, Schema } from "./internal/common.js"
import { decode } from "./internal/decode.js"
import type { UndecodedRpcResponse } from "./server.js"

export * as FetchTransport from "./internal/fetchTransport.js"

export type Rpc<C extends RpcSchemaAny, TR, TE> = C extends RpcSchemaWithInput<
  infer E,
  infer I,
  infer O
>
  ? (
      input: I,
    ) => Effect.Effect<TR, RpcServerError | RpcDecodeFailure | TE | E, O>
  : C extends RpcSchemaNoInput<infer E, infer O>
  ? Effect.Effect<TR, RpcServerError | RpcDecodeFailure | TE | E, O>
  : never

export type RpcClient<S extends RpcSchemas, TR, TE> = {
  [K in keyof S]: Rpc<S[K], TR, TE>
} & {
  _schemas: S
  _unsafeDecode: <M extends keyof S, O extends UndecodedRpcResponse<M>>(
    method: M,
    output: O,
  ) => S[M] extends { output: Schema.Schema<infer O> } ? O : never
}

export interface RpcClientTransport<R, E> {
  send: (u: unknown) => Effect.Effect<R, E, unknown>
}

const requestEncoder = Parser.encodeOrThrow(RpcRequest)
const responseDecoder = decode(RpcResponse)
const errorDecoder = decode(RpcServerError)

const unsafeDecode =
  <S extends RpcSchemas>(schemas: S) =>
  (method: keyof S, output: unknown) => {
    const a = decode(schemas[method].output)(output)
    if (a._tag !== "Left") {
      return a.right
    }

    throw "unsafeDecode fail"
  }

export const make = <
  S extends RpcSchemas,
  T extends RpcClientTransport<any, any>,
>(
  schemas: S,
  transport: T,
) =>
  Object.entries(schemas).reduce<
    RpcClient<
      S,
      T extends RpcClientTransport<infer R, any> ? R : never,
      T extends RpcClientTransport<any, infer E> ? E : never
    >
  >(
    (acc, [method, codec]) => ({
      ...acc,
      [method]: makeRpc(transport, codec, method),
    }),
    { _schemas: schemas, _unsafeDecode: unsafeDecode(schemas) } as any,
  )

const makeRpc = <S extends RpcSchemaAny, TR, TE>(
  transport: RpcClientTransport<TR, TE>,
  schema: S,
  method: string,
): Rpc<S, TR, TE> => {
  const send = (input: unknown) =>
    pipe(
      transport.send(
        requestEncoder({
          method: method as string,
          input,
        }),
      ),
      Effect.flatMap((u) =>
        pipe(
          responseDecoder(u),
          Either.flatMap(
            Either.match(
              (e) =>
                pipe(
                  decode(schema.error as Schema.Schema<any>)(e),
                  Either.catchAll(() => errorDecoder(e)),
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
    const cache = new Map<number, Effect.Effect<unknown, unknown, unknown>>()
    return ((input: any) => {
      const hash = Hash.hash(input)
      if (cache.has(hash)) {
        return cache.get(hash)
      }

      const effect = send(input)
      cache.set(hash, effect)
      return effect
    }) as any
  }

  return send(null) as any
}
