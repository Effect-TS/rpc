import * as Schema from "@effect/rpc/Schema"
import * as S from "@effect/schema/Schema"
import * as AST from "@effect/schema/AST"
import { dual, pipe } from "@effect/data/Function"
import * as Option from "@effect/data/Option"

/**
 * @category models
 * @since 1.0.0
 */
export type WebWorkerPrimitive =
  | null
  | undefined
  | boolean
  | number
  | bigint
  | string
  | Transferable
  | Date
  | RegExp
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array
  | BigInt64Array
  | BigUint64Array

/**
 * @category models
 * @since 1.0.0
 */
export type WebWorkerType =
  | WebWorkerPrimitive
  | Map<WebWorkerPrimitive, WebWorkerPrimitive>
  | Set<WebWorkerPrimitive>
  | ReadonlyArray<WebWorkerPrimitive>
  | Record<string, WebWorkerPrimitive>

/**
 * @category constructors
 * @since 1.0.0
 */
export const make = Schema.makeWith<"WebWorkerType", WebWorkerType>()

/**
 * @since 1.0.0
 */
export const TransferableAnnotationId = Symbol.for(
  "@effect/rpc-webworkers/TransferableAnnotationId",
)

/**
 * @since 1.0.0
 */
export type TransferableAnnotationId = typeof TransferableAnnotationId

/**
 * @category combinator
 * @since 1.0.0
 */
export const transferable: {
  <I>(f: (a: I) => ReadonlyArray<Transferable>): <A>(
    self: S.Schema<I, A>,
  ) => S.Schema<I, A>
  <I, A>(
    self: S.Schema<I, A>,
    f: (a: I) => ReadonlyArray<Transferable>,
  ): S.Schema<I, A>
} = dual(
  2,
  <I, A>(self: S.Schema<I, A>, f: (a: I) => ReadonlyArray<Transferable>) =>
    S.annotations({ [TransferableAnnotationId]: f })(self),
)

/**
 * @category combinator
 * @since 1.0.0
 */
export const getTransferables: {
  <I>(value: I): <A>(self: S.Schema<I, A>) => ReadonlyArray<Transferable>
  <I, A>(self: S.Schema<I, A>, value: I): ReadonlyArray<Transferable>
} = dual(
  2,
  <I, A>(self: S.Schema<I, A>, value: I): ReadonlyArray<Transferable> =>
    pipe(
      AST.getAnnotation<(value: I) => ReadonlyArray<Transferable>>(
        TransferableAnnotationId,
      )(self.ast),
      Option.map((f) => f(value)),
      Option.getOrElse(() => []),
    ),
)
