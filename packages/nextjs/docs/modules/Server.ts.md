---
title: Server.ts
nav_order: 5
parent: Modules
---

## Server overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [make](#make)
- [models](#models)
  - [RpcNextjsHandler (interface)](#rpcnextjshandler-interface)
- [tags](#tags)
  - [HttpRequest](#httprequest)

---

# constructors

## make

**Signature**

```ts
export declare function make<R extends RpcRouter.Base>(router: R): RpcNextjsHandler<R>
```

Added in v1.0.0

# models

## RpcNextjsHandler (interface)

**Signature**

```ts
export interface RpcNextjsHandler<R extends RpcRouter.Base> {
  (request: NextApiRequest, response: NextApiResponse): Effect.Effect<
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
