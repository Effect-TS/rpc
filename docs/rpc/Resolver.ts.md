---
title: Resolver.ts
nav_order: 3
parent: "@effect/rpc"
---

## Resolver overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [make](#make)
  - [makeSingle](#makesingle)
  - [makeSingleWithSchema](#makesinglewithschema)
  - [makeWithSchema](#makewithschema)
- [models](#models)
  - [RpcRequest (interface)](#rpcrequest-interface)
  - [RpcResolver (interface)](#rpcresolver-interface)
  - [RpcResponse (type alias)](#rpcresponse-type-alias)
- [tags](#tags)
  - [RpcResolver](#rpcresolver)

---

# constructors

## make

**Signature**

```ts
export declare const make: <R>(
  send: (requests: ReadonlyArray<RpcRequest.Payload>) => Effect.Effect<R, any, unknown>
) => RpcResolver<R>
```

Added in v1.0.0

## makeSingle

**Signature**

```ts
export declare const makeSingle: <R>(
  send: (request: RpcRequest.Payload) => Effect.Effect<R, any, unknown>
) => RpcResolver<R>
```

Added in v1.0.0

## makeSingleWithSchema

**Signature**

```ts
export declare const makeSingleWithSchema: <R>(
  send: (request: RpcRequest) => Effect.Effect<R, any, unknown>
) => RpcResolver<R>
```

Added in v1.0.0

## makeWithSchema

**Signature**

```ts
export declare const makeWithSchema: <R>(
  send: (requests: ReadonlyArray<RpcRequest>) => Effect.Effect<R, any, unknown>
) => RpcResolver<R>
```

Added in v1.0.0

# models

## RpcRequest (interface)

**Signature**

```ts
export interface RpcRequest extends Request.Request<RpcError, unknown> {
  readonly payload: RpcRequest.Payload
  readonly hash: number
  readonly schema: RpcSchema.Any
}
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

# tags

## RpcResolver

**Signature**

```ts
export declare const RpcResolver: Tag<RpcResolver<never>, RpcResolver<never>>
```

Added in v1.0.0
