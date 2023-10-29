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
    init: RpcSchema.Input<S['__setup']>,
    client: HttpClient.Client.Default,
    options?: Client.RpcClientOptions
  ): Effect.Effect<never, RpcError | RpcSchema.Error<S['__setup']>, Client.RpcClient<S, never>>
  <const S extends RpcService.DefinitionWithId>(
    schemas: S,
    client: HttpClient.Client.Default,
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
export * from '@effect/rpc/Client'
```

Added in v1.0.0
