---
title: Server.ts
nav_order: 7
parent: "@effect/rpc-nextjs"
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
  - [ApiRequest](#apirequest)

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
    Exclude<RpcHandlers.Services<R['handlers']>, NextApiRequest>,
    never,
    void
  >
}
```

Added in v1.0.0

# tags

## ApiRequest

**Signature**

```ts
export declare const ApiRequest: Context.Tag<NextApiRequest, NextApiRequest>
```

Added in v1.0.0
