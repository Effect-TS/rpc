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
  - [makePool](#makepool)
  - [makePoolLayer](#makepoollayer)
  - [makeWorker](#makeworker)
- [models](#models)
  - [RpcWebWorker (interface)](#rpcwebworker-interface)
  - [WebWorker (interface)](#webworker-interface)
  - [WebWorkerOptions (interface)](#webworkeroptions-interface)
  - [WebWorkerQueue (interface)](#webworkerqueue-interface)
- [tags](#tags)
  - [RpcWorkerPool](#rpcworkerpool)
  - [RpcWorkerPool (interface)](#rpcworkerpool-interface)
  - [RpcWorkerQueue](#rpcworkerqueue)
  - [RpcWorkerQueue (interface)](#rpcworkerqueue-interface)
  - [RpcWorkerResolverLive](#rpcworkerresolverlive)

---

# constructors

## make

**Signature**

```ts
export declare const make: Effect.Effect<
  RpcWorkerPool,
  never,
  Resolver.RpcResolver<never>
>
```

Added in v1.0.0

## makePool

**Signature**

```ts
export declare const makePool: <R, E>(
  create: (
    spawn: (
      evaluate: (id: number) => Worker | SharedWorker,
      permits?: number,
    ) => Effect.Effect<Scope, never, RpcWebWorker>,
  ) => Effect.Effect<R, E, RpcWorkerPool>,
) => Effect.Effect<R, E, RpcWorkerPool>
```

Added in v1.0.0

## makePoolLayer

**Signature**

```ts
export declare const makePoolLayer: <R, E>(
  create: (
    spawn: (
      evaluate: (id: number) => Worker | SharedWorker,
      permits?: number,
    ) => Effect.Effect<Scope, never, RpcWebWorker>,
  ) => Effect.Effect<R, E, RpcWorkerPool>,
) => Layer.Layer<Exclude<R, Scope>, E, RpcWorkerPool>
```

Added in v1.0.0

## makeWorker

**Signature**

```ts
export declare const makeWorker: <E, I, O>(
  evaluate: LazyArg<Worker | SharedWorker>,
  options: WebWorkerOptions<E, I, O>,
) => Effect.Effect<never, never, WebWorker<E, I, O>>
```

Added in v1.0.0

# models

## RpcWebWorker (interface)

**Signature**

```ts
export interface RpcWebWorker
  extends WebWorker<
    RpcTransportError,
    Resolver.RpcRequest,
    Resolver.RpcResponse
  > {}
```

Added in v1.0.0

## WebWorker (interface)

**Signature**

```ts
export interface WebWorker<E, I, O> {
  readonly run: Effect.Effect<never, E, never>
  readonly send: (request: I) => Effect.Effect<never, E, O>
}
```

Added in v1.0.0

## WebWorkerOptions (interface)

**Signature**

```ts
export interface WebWorkerOptions<E, I, O> {
  readonly payload: (value: I) => unknown
  readonly transferables: (value: I) => Array<Transferable>
  readonly onError: (error: ErrorEvent) => E
  readonly permits: number
  readonly makeQueue?: Effect.Effect<never, never, WebWorkerQueue<E, I, O>>
}
```

Added in v1.0.0

## WebWorkerQueue (interface)

**Signature**

```ts
export interface WebWorkerQueue<E, I, O> {
  readonly offer: (
    item: readonly [request: I, deferred: Deferred<E, O>],
  ) => Effect.Effect<never, never, void>

  readonly take: Effect.Effect<
    never,
    never,
    readonly [request: I, deferred: Deferred<E, O>]
  >
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
export interface RpcWorkerPool extends Pool<never, RpcWebWorker> {}
```

Added in v1.0.0

## RpcWorkerQueue

**Signature**

```ts
export declare const RpcWorkerQueue: Tag<RpcWorkerQueue, RpcWorkerQueue>
```

Added in v1.0.0

## RpcWorkerQueue (interface)

**Signature**

```ts
export interface RpcWorkerQueue
  extends WebWorkerQueue<
    RpcTransportError,
    Resolver.RpcRequest,
    Resolver.RpcResponse
  > {}
```

Added in v1.0.0

## RpcWorkerResolverLive

**Signature**

```ts
export declare const RpcWorkerResolverLive: Layer.Layer<
  RpcWorkerPool,
  never,
  Resolver.RpcResolver<never>
>
```

Added in v1.0.0
