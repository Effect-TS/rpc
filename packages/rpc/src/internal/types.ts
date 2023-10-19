export type DrainOuterGeneric<T> = [T] extends [unknown] ? T : never
