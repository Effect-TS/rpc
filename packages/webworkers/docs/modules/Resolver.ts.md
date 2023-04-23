---
title: Resolver.ts
nav_order: 2
parent: Modules
---

## Resolver overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [make](#make)
  - [makeEffect](#makeeffect)
  - [makeLayer](#makelayer)
  - [makeWorker](#makeworker)
- [models](#models)
  - [WebWorker (interface)](#webworker-interface)
  - [WebWorkerOptions (interface)](#webworkeroptions-interface)
  - [WebWorkerPoolConstructor (interface)](#webworkerpoolconstructor-interface)
  - [WebWorkerQueue (interface)](#webworkerqueue-interface)
- [tags](#tags)
  - [WebWorkerResolver](#webworkerresolver)
  - [WebWorkerResolver (interface)](#webworkerresolver-interface)

---

# constructors

## make

**Signature**

```ts
export declare const make: (
  pool: Pool<never, WebWorker<RpcTransportError, Resolver.RpcRequest, Resolver.RpcResponse>>
) => Resolver.RpcResolver<never>
```

Added in v1.0.0

## makeEffect

**Signature**

```ts
export declare const makeEffect: (
  evaluate: LazyArg<Worker>,
  options?:
    | {
        size?: Effect.Effect<never, never, number> | undefined
        workerPermits?: number | undefined
        makePool?: WebWorkerPoolConstructor | undefined
        makeWorkerQueue?:
          | Effect.Effect<never, never, WebWorkerQueue<RpcTransportError, Resolver.RpcRequest, Resolver.RpcResponse>>
          | undefined
      }
    | undefined
) => Effect.Effect<Scope, never, Resolver.RpcResolver<never>>
```

Added in v1.0.0

## makeLayer

**Signature**

```ts
export declare const makeLayer: (
  evaluate: LazyArg<Worker>,
  options?:
    | {
        size?: Effect.Effect<never, never, number> | undefined
        workerPermits?: number | undefined
        makePool?: WebWorkerPoolConstructor | undefined
        makeWorkerQueue?:
          | Effect.Effect<never, never, WebWorkerQueue<RpcTransportError, Resolver.RpcRequest, Resolver.RpcResponse>>
          | undefined
      }
    | undefined
) => Layer.Layer<never, never, WebWorkerResolver>
```

Added in v1.0.0

## makeWorker

**Signature**

```ts
export declare const makeWorker: <E, I, O>(
  evaluate: LazyArg<Worker>,
  options: WebWorkerOptions<E, I, O>
) => Effect.Effect<never, never, WebWorker<E, I, O>>
```

Added in v1.0.0

# models

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

## WebWorkerPoolConstructor (interface)

**Signature**

```ts
export interface WebWorkerPoolConstructor {
  (
    spawn: Effect.Effect<Scope, never, WebWorker<RpcTransportError, Resolver.RpcRequest, Resolver.RpcResponse>>,
    size: number
  ): Effect.Effect<Scope, never, Pool<never, WebWorker<RpcTransportError, Resolver.RpcRequest, Resolver.RpcResponse>>>
}
```

Added in v1.0.0

## WebWorkerQueue (interface)

**Signature**

```ts
export interface WebWorkerQueue<E, I, O> {
  readonly offer: (item: readonly [request: I, deferred: Deferred<E, O>]) => Effect.Effect<never, never, void>

  readonly take: Effect.Effect<never, never, readonly [request: I, deferred: Deferred<E, O>]>
}
```

Added in v1.0.0

# tags

## WebWorkerResolver

**Signature**

```ts
export declare const WebWorkerResolver: Tag<WebWorkerResolver, Resolver.RpcResolver<never>>
```

Added in v1.0.0

## WebWorkerResolver (interface)

**Signature**

```ts
export interface WebWorkerResolver {
  readonly _: unique symbol
}
```

Added in v1.0.0
