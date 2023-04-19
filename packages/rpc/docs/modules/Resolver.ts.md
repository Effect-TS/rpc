---
title: Resolver.ts
nav_order: 3
parent: Modules
---

## Resolver overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [make](#make)
- [models](#models)
  - [RpcRequest (interface)](#rpcrequest-interface)
  - [RpcResolver (interface)](#rpcresolver-interface)
  - [RpcResponse (type alias)](#rpcresponse-type-alias)

---

# constructors

## make

**Signature**

```ts
export declare const make: <R>(
  send: (requests: ReadonlyArray<RpcRequest>) => Effect.Effect<R, any, readonly unknown[]>
) => RpcResolver<R>
```

Added in v1.0.0

# models

## RpcRequest (interface)

**Signature**

```ts
export interface RpcRequest extends Request.Request<RpcError, unknown>, RpcRequest.Fields {}
```

Added in v1.0.0

## RpcResolver (interface)

**Signature**

```ts
export interface RpcResolver<R> extends Resolver.RequestResolver<R, RpcRequest> {}
```

Added in v1.0.0

## RpcResponse (type alias)

**Signature**

```ts
export type RpcResponse = { _tag: 'Left'; left: RpcError } | { _tag: 'Right'; right: unknown }
```

Added in v1.0.0
