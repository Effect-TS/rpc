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
- [models](#models)
  - [Rpc (type alias)](#rpc-type-alias)
  - [RpcClient (type alias)](#rpcclient-type-alias)
  - [RpcClientOptions (interface)](#rpcclientoptions-interface)

---

# constructors

## make

Creates an RPC client

**Signature**

```ts
export declare const make: <S extends any, T extends any>(
  schemas: S,
  transport: T,
  options?: RpcClientOptions | undefined
) => RpcClient<S, T extends any ? R : never>
```

Added in v1.0.0

# models

## Rpc (type alias)

Represents an RPC method signature.

**Signature**

```ts
export type Rpc<C extends RpcSchema.Any, TR> = C extends RpcSchema.IO<
  infer _IE,
  infer E,
  infer _II,
  infer I,
  infer _IO,
  infer O
>
  ? (input: I) => Effect<TR, RpcError | E, O>
  : C extends RpcSchema.NoError<infer _II, infer I, infer _IO, infer O>
  ? (input: I) => Effect<TR, RpcError, O>
  : C extends RpcSchema.NoInput<infer _IE, infer E, infer _IO, infer O>
  ? Effect<TR, RpcError | E, O>
  : C extends RpcSchema.NoInputNoError<infer _IO, infer O>
  ? Effect<TR, RpcError, O>
  : never
```

Added in v1.0.0

## RpcClient (type alias)

Represents an RPC client

**Signature**

```ts
export type RpcClient<S extends RpcService.DefinitionWithId, TR> = RpcClientRpcs<S, TR> & {
  _schemas: S
  _unsafeDecode: <M extends RpcService.Methods<S>, O extends UndecodedRpcResponse<M, any>>(
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
