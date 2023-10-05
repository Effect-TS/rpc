---
title: Schema.ts
nav_order: 5
parent: "@effect/rpc-webworkers"
---

## Schema overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinator](#combinator)
  - [getTransferables](#gettransferables)
  - [transferable](#transferable)
- [constructors](#constructors)
  - [context](#context)
  - [make](#make)
- [models](#models)
  - [Primitive (type alias)](#primitive-type-alias)
  - [WebWorkerType (type alias)](#webworkertype-type-alias)
- [utils](#utils)
  - [TransferableAnnotationId](#transferableannotationid)
  - [TransferableAnnotationId (type alias)](#transferableannotationid-type-alias)

---

# combinator

## getTransferables

**Signature**

```ts
export declare const getTransferables: {
  <I>(value: I): <A>(self: S.Schema<I, A>) => Array<Transferable>
  <I, A>(self: S.Schema<I, A>, value: I): Array<Transferable>
}
```

Added in v1.0.0

## transferable

**Signature**

```ts
export declare const transferable: {
  <I>(f: (a: I) => ReadonlyArray<Transferable>): <A>(self: S.Schema<I, A>) => S.Schema<I, A>
  <I, A>(self: S.Schema<I, A>, f: (a: I) => ReadonlyArray<Transferable>): S.Schema<I, A>
}
```

Added in v1.0.0

# constructors

## context

**Signature**

```ts
export declare const context: <R>() => S.Schema<Context<R>, Context<R>>
```

Added in v1.0.0

## make

**Signature**

```ts
export declare const make: <S>(
  schema: S
) => Schema.RpcService.Simplify<Schema.RpcService.Validate<'WebWorkerType', any, S>, never, never>
```

Added in v1.0.0

# models

## Primitive (type alias)

**Signature**

```ts
export type Primitive =
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
```

Added in v1.0.0

## WebWorkerType (type alias)

**Signature**

```ts
export type WebWorkerType =
  | Primitive
  | Map<Primitive, Primitive>
  | Set<Primitive>
  | ReadonlyArray<Primitive>
  | Record<string, Primitive>
```

Added in v1.0.0

# utils

## TransferableAnnotationId

**Signature**

```ts
export declare const TransferableAnnotationId: typeof TransferableAnnotationId
```

Added in v1.0.0

## TransferableAnnotationId (type alias)

**Signature**

```ts
export type TransferableAnnotationId = typeof TransferableAnnotationId
```

Added in v1.0.0
