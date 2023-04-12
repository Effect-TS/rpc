import { RpcServiceId } from "@effect/rpc/Schema"
import type { RpcSchema, RpcService } from "@effect/rpc/Schema"

/** @internal */
export type SimplifySchema<T extends RpcService.Definition> = T extends infer S
  ? RpcService.WithId<{ [K in Exclude<keyof S, RpcServiceId>]: S[K] }>
  : never

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
