import type * as Effect from "@effect/io/Effect"
import type { RpcEncodeFailure } from "@effect/rpc/Error"
import type { RpcSchema, RpcService } from "@effect/rpc/Schema"
import { RpcServiceId } from "@effect/rpc/Schema"
import { encodeEffect } from "@effect/rpc/internal/codec"
import * as Schema from "@effect/schema/Schema"

/** @internal */
export const methodsMap = <S extends RpcService.DefinitionWithId>(
  schemas: S,
  prefix = "",
): Record<string, RpcSchema.Any> =>
  Object.entries(schemas).reduce((acc, [method, schema]) => {
    if (RpcServiceId in schema) {
      return {
        ...acc,
        ...methodsMap(schema, `${prefix}${method}.`),
      }
    }
    return { ...acc, [`${prefix}${method}`]: schema }
  }, {})

/** @internal */
export const inputEncodeMap = <S extends RpcService.DefinitionWithId>(
  schemas: S,
  prefix = "",
): Record<
  string,
  (input: unknown) => Effect.Effect<never, RpcEncodeFailure, unknown>
> =>
  Object.entries(schemas).reduce((acc, [method, schema]) => {
    if (RpcServiceId in schema) {
      return {
        ...acc,
        ...methodsMap(schema, `${prefix}${method}.`),
      }
    } else if (!("input" in schema)) {
      return acc
    }

    return {
      ...acc,
      [`${prefix}${method}`]: encodeEffect(Schema.to(schema.input)),
    }
  }, {})
