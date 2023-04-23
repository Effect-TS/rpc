---
title: Server.ts
nav_order: 6
parent: Modules
---

## Server overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [make](#make)
- [models](#models)
  - [RpcWorkerHandler (interface)](#rpcworkerhandler-interface)

---

# constructors

## make

**Signature**

```ts
export declare const make: <Router extends RpcRouter.Base>(router: Router) => RpcWorkerHandler<Router>
```

Added in v1.0.0

# models

## RpcWorkerHandler (interface)

**Signature**

```ts
export interface RpcWorkerHandler<R extends RpcRouter.Base> {
  (message: MessageEvent<any>): Effect<Exclude<RpcHandlers.Services<R['handlers']>, Span>, never, void>
}
```

Added in v1.0.0
