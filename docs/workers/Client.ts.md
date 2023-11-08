---
title: Client.ts
nav_order: 1
parent: "@effect/rpc-workers"
---

## Client overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [make](#make)
  - [makeFromPool](#makefrompool)
- [exports](#exports)
  - [From "@effect/rpc/Client"](#from-effectrpcclient)

---

# constructors

## make

**Signature**

```ts
export declare const make: {
  <const S extends RpcService.DefinitionWithSetup>(
    schemas: S,
    init: RpcSchema.Input<S["__setup"]>,
    options?: Client.RpcClientOptions
  ): Effect.Effect<never, RpcError | RpcSchema.Error<S["__setup"]>, Client.RpcClient<S, Resolver.RpcWorkerPool>>
  <const S extends RpcService.DefinitionWithId>(
    schemas: S,
    options?: Client.RpcClientOptions
  ): Client.RpcClient<S, Resolver.RpcWorkerPool>
}
```

Added in v1.0.0

## makeFromPool

**Signature**

```ts
export declare const makeFromPool: {
  <const S extends RpcService.DefinitionWithSetup>(
    schemas: S,
    pool: Resolver.RpcWorkerPool,
    init: RpcSchema.Input<S["__setup"]>,
    options?: Client.RpcClientOptions
  ): Effect.Effect<never, RpcError | RpcSchema.Error<S["__setup"]>, Client.RpcClient<S, never>>
  <const S extends RpcService.DefinitionWithId>(
    schemas: S,
    pool: Resolver.RpcWorkerPool,
    options?: Client.RpcClientOptions
  ): Client.RpcClient<S, never>
}
```

Added in v1.0.0

# exports

## From "@effect/rpc/Client"

Re-exports all named exports from the "@effect/rpc/Client" module.

**Signature**

```ts
export * from "@effect/rpc/Client"
```

Added in v1.0.0
