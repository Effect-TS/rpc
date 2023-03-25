export type Simplify<T> = T extends infer O ? { [K in keyof O]: O[K] } : never
