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
  send: (requests: ReadonlyArray<RpcRequest>) => Effect.Effect<R, any, unknown>
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
export interface RpcResolver<R> extends Resolver.RequestResolver<RpcRequest, R> {}
```

Added in v1.0.0

## RpcResponse (type alias)

**Signature**

```ts
export type RpcResponse = RpcResponse.Error | RpcResponse.Success
```

Added in v1.0.0
