import { RpcSchema, RpcSchemaInput } from "@effect/rpc"

export type Simplify<T extends RpcSchemaInput> = T extends infer O
  ? RpcSchema<{ [K in keyof O]: O[K] }>
  : never
