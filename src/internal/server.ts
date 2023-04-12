import {
  RpcDefinitionAny,
  RpcHandlerFromMethod,
  RpcHandlers,
  RpcHandlersDeps,
  RpcRouterBase,
} from "@effect/rpc/Server"
import * as Schema from "@effect/schema/Schema"
import { RpcRequest, RpcResponse } from "@effect/rpc/DataSource"
import * as Either from "@effect/data/Either"
import { identity, pipe } from "@effect/data/Function"
import * as Effect from "@effect/io/Effect"
import { schemaMethodsMap } from "@effect/rpc/internal/schema"
import { RpcNotFound } from "@effect/rpc/Error"
import { decode, encode } from "@effect/rpc/internal/decode"
import { RpcRequestA } from "../Schema.js"

/** @internal */
export const schemaHandlersMap = <H extends RpcHandlers>(
  handlers: H,
  prefix = "",
): Record<string, RpcDefinitionAny> =>
  Object.entries(handlers).reduce((acc, [method, definition]) => {
    if ("handlers" in definition) {
      return {
        ...acc,
        ...schemaHandlersMap(definition.handlers, `${prefix}${method}.`),
      }
    }
    return { ...acc, [`${prefix}${method}`]: definition }
  }, {})

/** @internal */
const responseEncoder = Schema.encode(RpcResponse)

/** @internal */
export const handleSingleRequest = <R extends RpcRouterBase>(
  router: R,
): ((request: {
  readonly method: string
  readonly input?: unknown
}) => Effect.Effect<RpcHandlersDeps<R["handlers"]>, never, unknown>) => {
  const schemaMap = schemaMethodsMap(router.schema)
  const handlerMap = schemaHandlersMap(router.handlers)

  return (request) =>
    pipe(
      Either.Do(),
      Either.bind("schema", () =>
        Either.fromNullable(
          schemaMap[request.method],
          (): RpcNotFound => ({
            _tag: "RpcNotFound",
            method: request.method,
          }),
        ),
      ),
      Either.bind("handler", () =>
        Either.fromNullable(
          handlerMap[request.method],
          (): RpcNotFound => ({
            _tag: "RpcNotFound",
            method: request.method,
          }),
        ),
      ),
      Either.bind("input", ({ handler, schema }) =>
        !Effect.isEffect(handler) && "input" in schema
          ? decode(schema.input as Schema.Schema<any>)(request.input)
          : Either.right(null),
      ),
      Either.map(({ handler, input, schema }) => {
        const effect: Effect.Effect<any, unknown, unknown> = Effect.isEffect(
          handler,
        )
          ? handler
          : (handler as any)(input)

        return pipe(
          effect,
          Effect.map(encode(schema.output)),
          Effect.catchAll((_) =>
            Effect.succeed(
              Either.flatMap(
                encode(
                  "error" in schema ? schema.error : (Schema.never as any),
                )(_),
                Either.left,
              ),
            ),
          ),
        )
      }),
      Either.match(
        (_) => Effect.succeed(responseEncoder(Either.left(_))),
        identity,
      ),
    )
}

/** @internal */
export const handleRequestUnion = <R extends RpcRouterBase>(router: R) => {
  const handlerMap = schemaHandlersMap(router.handlers)

  return <Req extends RpcRequestA<R["schema"]>>(
    request: Req,
  ): Req extends { method: infer M }
    ? RpcHandlerFromMethod<M, R["handlers"]>
    : never => {
    const req = request as RpcRequest
    const handler = handlerMap[req.method]
    if (Effect.isEffect(handler)) {
      return handler as any
    }
    return (handler as any)(req.input) as any
  }
}
