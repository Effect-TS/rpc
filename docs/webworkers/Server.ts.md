---
title: Server.ts
nav_order: 6
parent: "@effect/rpc-webworkers"
---

## Server overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [make](#make)
  - [makeHandler](#makehandler)
- [models](#models)
  - [RpcWorker (type alias)](#rpcworker-type-alias)
  - [RpcWorkerHandler (interface)](#rpcworkerhandler-interface)

---

# constructors

## make

**Signature**

```ts
export declare const make: <Router extends RpcRouter.Base>(router: Router) => RpcWorker<Router>
```

Added in v1.0.0

## makeHandler

**Signature**

```ts
export declare const makeHandler: {
  <R extends RpcRouter.WithSetup>(router: R): Effect<
    Scope,
    never,
    (port: typeof globalThis | MessagePort) => RpcWorkerHandler<R>
  >
  <R extends RpcRouter.WithoutSetup>(router: R): (port: typeof globalThis | MessagePort) => RpcWorkerHandler<R>
}
```

Added in v1.0.0

# models

## RpcWorker (type alias)

**Signature**

```ts
export type RpcWorker<R extends RpcRouter.Base> = R extends RpcRouter.WithSetup
  ? Effect<Exclude<RpcHandlers.Services<R['handlers']>, Span | RpcRouter.SetupServices<R>>, never, void>
  : Effect<Exclude<RpcHandlers.Services<R['handlers']>, Span>, never, void>
```

Added in v1.0.0

## RpcWorkerHandler (interface)

**Signature**

```ts
export interface RpcWorkerHandler<R extends RpcRouter.Base> {
  (message: MessageEvent<any>): Effect<Exclude<RpcHandlers.Services<R['handlers']>, Span>, never, void>
}
```

Added in v1.0.0
