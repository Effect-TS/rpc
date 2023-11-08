---
title: Resolver.ts
nav_order: 3
parent: "@effect/rpc-workers"
---

## Resolver overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [make](#make)
  - [makeFromContext](#makefromcontext)
  - [makePool](#makepool)
  - [makePoolLayer](#makepoollayer)
- [models](#models)
  - [RpcWorkerPool (namespace)](#rpcworkerpool-namespace)
    - [Options (type alias)](#options-type-alias)
- [tags](#tags)
  - [RpcWorkerPool](#rpcworkerpool)
  - [RpcWorkerPool (interface)](#rpcworkerpool-interface)

---

# constructors

## make

**Signature**

```ts
export declare const make: (pool: RpcWorkerPool) => Resolver.RpcResolver<never>
```

Added in v1.0.0

## makeFromContext

**Signature**

```ts
export declare const makeFromContext: Effect.Effect<RpcWorkerPool, never, Resolver.RpcResolver<never>>
```

Added in v1.0.0

## makePool

**Signature**

```ts
export declare const makePool: (
  options: RpcWorkerPool.Options
) => Effect.Effect<Scope | Worker.WorkerManager, never, RpcWorkerPool>
```

Added in v1.0.0

## makePoolLayer

**Signature**

```ts
export declare const makePoolLayer: (
  options: RpcWorkerPool.Options
) => Layer.Layer<Worker.WorkerManager, never, RpcWorkerPool>
```

Added in v1.0.0

# models

## RpcWorkerPool (namespace)

Added in v1.0.0

### Options (type alias)

**Signature**

```ts
export type Options = Omit<Worker.Worker.Options<Resolver.RpcRequest>, "transfers" | "encode" | "onCreate"> & {
  readonly size: number
}
```

Added in v1.0.0

# tags

## RpcWorkerPool

**Signature**

```ts
export declare const RpcWorkerPool: Tag<RpcWorkerPool, RpcWorkerPool>
```

Added in v1.0.0

## RpcWorkerPool (interface)

**Signature**

```ts
export interface RpcWorkerPool
  extends Worker.WorkerPool<Resolver.RpcRequest, RpcTransportError, Resolver.RpcResponse> {}
```

Added in v1.0.0
