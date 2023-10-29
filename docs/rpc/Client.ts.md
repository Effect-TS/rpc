---
title: Client.ts
nav_order: 1
parent: "@effect/rpc"
---

## Client overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [make](#make)
- [models](#models)
  - [Rpc (type alias)](#rpc-type-alias)
  - [RpcClient (type alias)](#rpcclient-type-alias)
  - [RpcClientOptions (interface)](#rpcclientoptions-interface)

---

# constructors

## make

Creates an RPC client with the specified resolver

**Signature**

```ts
export declare const make: {
  <
    const S extends RpcService.DefinitionWithSetup,
    Resolver extends RpcResolver<never> | Effect<any, never, RpcResolver<never>>
  >(
    schemas: S,
    resolver: Resolver,
    init: RpcSchema.Input<S['__setup']>,
    options?: RpcClientOptions | undefined
  ): Effect<
    never,
    RpcError | RpcSchema.Error<S['__setup']>,
    RpcClient<S, [Resolver] extends [Effect<any, any, any>] ? Effect.Context<Resolver> : never>
  >
  <
    const S extends RpcService.DefinitionWithId,
    Resolver extends RpcResolver<never> | Effect<any, never, RpcResolver<never>>
  >(
    schemas: S,
    resolver: Resolver,
    options?: RpcClientOptions | undefined
  ): RpcClient<S, [Resolver] extends [Effect<any, any, any>] ? Effect.Context<Resolver> : never>
}
```

Added in v1.0.0

# models

## Rpc (type alias)

Represents an RPC method signature.

**Signature**

```ts
export type Rpc<C extends RpcSchema.Any, R, SE> = C extends RpcSchema.IO<
  infer _IE,
  infer E,
  infer _II,
  infer I,
  infer _IO,
  infer O
>
  ? (input: I) => Effect<R, RpcError | SE | E, O>
  : C extends RpcSchema.NoError<infer _II, infer I, infer _IO, infer O>
  ? (input: I) => Effect<R, RpcError | SE, O>
  : C extends RpcSchema.NoOutput<infer _IE, infer E, infer _II, infer I>
  ? (input: I) => Effect<R, RpcError | SE | E, void>
  : C extends RpcSchema.NoErrorNoOutput<infer _II, infer I>
  ? (input: I) => Effect<R, RpcError | SE, void>
  : C extends RpcSchema.NoInput<infer _IE, infer E, infer _IO, infer O>
  ? Effect<R, RpcError | SE | E, O>
  : C extends RpcSchema.NoInputNoError<infer _IO, infer O>
  ? Effect<R, RpcError | SE, O>
  : never
```

Added in v1.0.0

## RpcClient (type alias)

Represents an RPC client

**Signature**

```ts
export type RpcClient<S extends RpcService.DefinitionWithId, R> = RpcClientRpcs<S, R> & {
  readonly _schemas: S
  readonly _unsafeDecode: <M extends RpcService.Methods<S>, O extends UndecodedRpcResponse<M, any>>(
    method: M,
    output: O
  ) => O extends UndecodedRpcResponse<M, infer O> ? O : never
}
```

Added in v1.0.0

## RpcClientOptions (interface)

**Signature**

```ts
export interface RpcClientOptions {
  readonly spanPrefix?: string
}
```

Added in v1.0.0
