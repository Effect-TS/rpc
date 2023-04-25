---
title: Server.ts
nav_order: 6
parent: "@effect/rpc-http"
---

## Server overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [make](#make)
- [models](#models)
  - [HttpRequest (interface)](#httprequest-interface)
  - [RpcHttpHandler (interface)](#rpchttphandler-interface)
- [tags](#tags)
  - [HttpRequest](#httprequest)

---

# constructors

## make

**Signature**

```ts
export declare const make: <R extends RpcRouter.Base>(router: R) => RpcHttpHandler<R>
```

Added in v1.0.0

# models

## HttpRequest (interface)

**Signature**

```ts
export interface HttpRequest {
  readonly url: string
  readonly headers: Headers
  readonly body: unknown
}
```

Added in v1.0.0

## RpcHttpHandler (interface)

**Signature**

```ts
export interface RpcHttpHandler<R extends RpcRouter.Base> {
  (request: HttpRequest): Effect<
    Exclude<RpcHandlers.Services<R['handlers']>, HttpRequest | Span>,
    never,
    ReadonlyArray<RpcResponse>
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
