---
title: Schema.ts
nav_order: 5
parent: Modules
---

## Schema overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [make](#make)
  - [makeRequestUnion](#makerequestunion)
  - [makeWith](#makewith)
- [utils](#utils)
  - [RpcServiceId](#rpcserviceid)
  - [RpcServiceId (type alias)](#rpcserviceid-type-alias)

---

# constructors

## make

Make a RPC service schema that can be encoded and decoded from JSON.

**Signature**

```ts
export declare const make: <S>(schema: S) => RpcService.Simplify<RpcService.Validate<'Schema.Json', Schema.Json, S>>
```

Added in v1.0.0

## makeRequestUnion

**Signature**

```ts
export declare const makeRequestUnion: <S extends RpcService.Definition>(
  schema: S
) => Schema.Schema<RpcRequestSchema.From<S, ''>, RpcRequestSchema.To<S, ''>>
```

Added in v1.0.0

## makeWith

**Signature**

```ts
export declare const makeWith: <VL extends string, V>() => <S extends RpcService.Definition>(
  schema: S
) => RpcService.Simplify<RpcService.Validate<VL, V, S>>
```

Added in v1.0.0

# utils

## RpcServiceId

**Signature**

```ts
export declare const RpcServiceId: typeof RpcServiceId
```

Added in v1.0.0

## RpcServiceId (type alias)

**Signature**

```ts
export type RpcServiceId = typeof RpcServiceId
```

Added in v1.0.0
