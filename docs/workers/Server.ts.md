---
title: Server.ts
nav_order: 7
parent: "@effect/rpc-workers"
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
export declare const make: (router: RpcRouter.Base) => Effect<Scope | Runner.PlatformRunner, Error.WorkerError, void>
```

Added in v1.0.0
