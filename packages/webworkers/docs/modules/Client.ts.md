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
