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

---

# constructors

## make

**Signature**

```ts
export declare const make: <R extends RpcRouter.Base>(
  router: R
) => App.Default<RpcRouter.Services<R>, RpcHandlers.Errors<R["handlers"], []> | ServerError.RequestError>
```

Added in v1.0.0
