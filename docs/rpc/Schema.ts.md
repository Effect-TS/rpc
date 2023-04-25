---
title: Schema.ts
nav_order: 5
parent: "@effect/rpc"
---

## Schema overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [withServiceError](#withserviceerror)
- [constructors](#constructors)
  - [make](#make)
  - [makeRequestUnion](#makerequestunion)
  - [makeWith](#makewith)
- [utils](#utils)
  - [RpcServiceErrorId](#rpcserviceerrorid)
  - [RpcServiceErrorId (type alias)](#rpcserviceerrorid-type-alias)
  - [RpcServiceId](#rpcserviceid)
  - [RpcServiceId (type alias)](#rpcserviceid-type-alias)

---

# combinators

## withServiceError

Add a service level error, which can then be used with `Router.provideServiceEffect`.

**Signature**

```ts
export declare const withServiceError: {
  <EI extends Schema.Json, E>(error: Schema.Schema<EI, E>): <S extends RpcService.DefinitionWithId>(
    self: S
  ) => RpcService.WithId<S, EI | Schema.From<S[typeof RpcServiceErrorId]>, E | Schema.To<S[typeof RpcServiceErrorId]>>
  <S extends RpcService.DefinitionWithId, EI extends Schema.Json, E>(
    self: S,
    error: Schema.Schema<EI, E>
  ): RpcService.WithId<S, EI | Schema.From<S[typeof RpcServiceErrorId]>, E | Schema.To<S[typeof RpcServiceErrorId]>>
}
```

Added in v1.0.0

# constructors

## make

Make a RPC service schema that can be encoded and decoded from JSON.

**Signature**

```ts
export declare const make: <S>(
  schema: S
) => RpcService.Simplify<RpcService.Validate<'Schema.Json', Schema.Json, S>, never, never>
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
) => RpcService.Simplify<RpcService.Validate<VL, V, S>, never, never>
```

Added in v1.0.0

# utils

## RpcServiceErrorId

**Signature**

```ts
export declare const RpcServiceErrorId: typeof RpcServiceErrorId
```

Added in v1.0.0

## RpcServiceErrorId (type alias)

**Signature**

```ts
export type RpcServiceErrorId = typeof RpcServiceErrorId
```

Added in v1.0.0

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
