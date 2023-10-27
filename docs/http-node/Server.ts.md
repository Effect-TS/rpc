---
title: Server.ts
nav_order: 7
parent: "@effect/rpc-http-node"
---

## Server overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [make](#make)
- [models](#models)
  - [RpcNodeHttpHandler (interface)](#rpcnodehttphandler-interface)
- [tags](#tags)
  - [IncomingMessage](#incomingmessage)

---

# constructors

## make

**Signature**

```ts
export declare function make<R extends RpcRouter.Base>(router: R): RpcNodeHttpHandler<R>
```

Added in v1.0.0

# models

## RpcNodeHttpHandler (interface)

**Signature**

```ts
export interface RpcNodeHttpHandler<R extends RpcRouter.Base> {
  (request: Http.IncomingMessage, response: Http.ServerResponse): Effect.Effect<
    Exclude<RpcHandlers.Services<R['handlers']>, Http.IncomingMessage>,
    never,
    void
  >
}
```

Added in v1.0.0

# tags

## IncomingMessage

**Signature**

```ts
export declare const IncomingMessage: Context.Tag<Http.IncomingMessage, Http.IncomingMessage>
```

Added in v1.0.0
