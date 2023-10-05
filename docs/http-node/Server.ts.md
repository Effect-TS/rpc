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
  - [HttpRequest](#httprequest)

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
  (request: IncomingMessage, response: ServerResponse): Effect.Effect<
    Exclude<RpcHandlers.Services<R['handlers']>, HttpRequest | Span>,
    never,
    void
  >
}
```

Added in v1.0.0

# tags

## HttpRequest

**Signature**

```ts
export declare const HttpRequest: Tag<HttpRequest, HttpRequest>
```

Added in v1.0.0
