import type { RpcSchema, RpcService } from "@effect/rpc/Schema"
import { RpcServiceId } from "@effect/rpc/Schema"

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
