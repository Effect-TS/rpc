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
export declare const make: <S extends RpcService.DefinitionWithId>(
  schemas: S,
  ...args: [S] extends [RpcService.DefinitionWithSetup]
    ? [init: RpcSchema.Input<S["__setup"]>, options?: Client.RpcClientOptions | undefined]
    : [options?: Client.RpcClientOptions | undefined]
) => [S] extends [RpcService.DefinitionWithSetup]
  ? Effect.Effect<never, RpcError | RpcSchema.Error<S["__setup"]>, Client.RpcClient<S, Resolver.RpcWorkerPool>>
  : Client.RpcClient<S, Resolver.RpcWorkerPool>
```

Added in v1.0.0

## makeFromPool

**Signature**

```ts
export declare const makeFromPool: <S extends RpcService.DefinitionWithId>(
  schemas: S,
  pool: Resolver.RpcWorkerPool,
  ...args: [S] extends [RpcService.DefinitionWithSetup]
    ? [init: RpcSchema.Input<S["__setup"]>, options?: Client.RpcClientOptions | undefined]
    : [options?: Client.RpcClientOptions | undefined]
) => [S] extends [RpcService.DefinitionWithSetup]
  ? Effect.Effect<never, RpcError | RpcSchema.Error<S["__setup"]>, Client.RpcClient<S, never>>
  : Client.RpcClient<S, Resolver.RpcWorkerPool>
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
