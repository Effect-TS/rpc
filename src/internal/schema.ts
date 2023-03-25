import {
  RpcSchema,
  RpcSchemaAny,
  RpcSchemaId,
  RpcSchemaInput,
  RpcSchemas,
} from "@effect/rpc/Schema"

/** @internal */
export type SimplifySchema<T extends RpcSchemaInput> = T extends infer O
  ? RpcSchema<{ [K in keyof O]: O[K] }>
  : never

/** @internal */
export const schemaMethodsMap = <S extends RpcSchemas>(
  schemas: S,
  prefix = "",
): Record<string, RpcSchemaAny> =>
  Object.entries(schemas).reduce((acc, [method, schema]) => {
    if (RpcSchemaId in schema) {
      return {
        ...acc,
        ...schemaMethodsMap(schema, `${prefix}${method}.`),
      }
    }
    return { ...acc, [`${prefix}${method}`]: schema }
  }, {})
