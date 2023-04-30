---
title: Client.ts
nav_order: 1
parent: "@effect/rpc-http"
---

## Client overview

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
export declare const make: <S extends RpcService.DefinitionWithoutSetup>(
  schemas: S,
  options: Client.RpcClientOptions & Resolver.FetchResolverOptions
) => Client.RpcClient<S, never>
```

Added in v1.0.0
