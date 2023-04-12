import * as Either from "@effect/data/Either"
import { identity, pipe } from "@effect/data/Function"
import * as Effect from "@effect/io/Effect"
import type { RpcRequest } from "@effect/rpc/DataSource"
import type { RpcNotFound } from "@effect/rpc/Error"
import type { RpcHandler, RpcHandlers, RpcRouter } from "@effect/rpc/Server"
import * as dataSource from "@effect/rpc/internal/dataSource"
import { decode, encode } from "@effect/rpc/internal/codec"
import { methodsMap } from "@effect/rpc/internal/schema"
import * as Schema from "@effect/schema/Schema"
import type { RpcRequestSchema } from "@effect/rpc/Schema"

/** @internal */
export const schemaHandlersMap = <H extends RpcHandlers>(
  handlers: H,
  prefix = "",
): Record<string, RpcHandler.Any> =>
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
const responseEncoder = Schema.encode(dataSource.RpcResponse)

/** @internal */
export const handleSingleRequest = <R extends RpcRouter.Base>(
  router: R,
): ((request: {
  readonly _tag: string
  readonly input?: unknown
}) => Effect.Effect<RpcHandlers.Services<R["handlers"]>, never, unknown>) => {
  const schemaMap = methodsMap(router.schema)
  const handlerMap = schemaHandlersMap(router.handlers)

  return (request) =>
    pipe(
      Either.Do(),
      Either.bind("schema", () =>
        Either.fromNullable(
          schemaMap[request._tag],
          (): RpcNotFound => ({
            _tag: "RpcNotFound",
            method: request._tag,
          }),
        ),
      ),
      Either.bind("handler", () =>
        Either.fromNullable(
          handlerMap[request._tag],
          (): RpcNotFound => ({
            _tag: "RpcNotFound",
            method: request._tag,
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
export const handleRequestUnion = <R extends RpcRouter.Base>(router: R) => {
  const handlerMap = schemaHandlersMap(router.handlers)

  return <Req extends RpcRequestSchema.To<R["schema"]>>(
    request: Req,
  ): Req extends { _tag: infer M }
    ? RpcHandler.FromMethod<M, R["handlers"]>
    : never => {
    const handler = handlerMap[(request as RpcRequest)._tag]
    if (Effect.isEffect(handler)) {
      return handler as any
    }
    return (handler as any)((request as RpcRequest).input) as any
  }
}
