---
title: Client.ts
nav_order: 1
parent: Modules
---

## Client overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [make](#make)
  - [makeWith](#makewith)

---

# constructors

## make

**Signature**

```ts
export declare const make: <S extends RpcService.DefinitionWithId>(
  schemas: S,
  options?: Client.RpcClientOptions | undefined
) => Client.RpcClient<S, any>
```

Added in v1.0.0

## makeWith

**Signature**

```ts
export declare const makeWith: <S extends RpcService.DefinitionWithId>(
  schemas: S,
  evaluate: LazyArg<Worker>,
  options?: { size?: Effect.Effect<never, never, number> | undefined; workerPermits?: number | undefined } | undefined,
  clientOptions?: Client.RpcClientOptions | undefined
) => Effect.Effect<Scope, never, Client.RpcClient<S, never>>
```

Added in v1.0.0
