---
title: Resolver.ts
nav_order: 4
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
- [utils](#utils)
  - [RpcRequest (namespace)](#rpcrequest-namespace)
    - [NoInput (interface)](#noinput-interface)
    - [Payload (interface)](#payload-interface)
    - [Tracing (interface)](#tracing-interface)
    - [WithInput (interface)](#withinput-interface)
  - [RpcResponse (namespace)](#rpcresponse-namespace)
    - [Error (interface)](#error-interface)
    - [Success (interface)](#success-interface)

---

# constructors

## make

**Signature**

```ts
export declare const make: <R>(
  send: (requests: ReadonlyArray<RpcRequest.Payload>) => Effect.Effect<R, RpcTransportError, unknown>
) => RpcResolver<R>
```

Added in v1.0.0

## makeSingle

**Signature**

```ts
export declare const makeSingle: <R>(
  send: (request: RpcRequest.Payload) => Effect.Effect<R, RpcTransportError, unknown>
) => RpcResolver<R>
```

Added in v1.0.0

## makeSingleWithSchema

**Signature**

```ts
export declare const makeSingleWithSchema: <R>(
  send: (request: RpcRequest) => Effect.Effect<R, RpcTransportError, unknown>
) => RpcResolver<R>
```

Added in v1.0.0

## makeWithSchema

**Signature**

```ts
export declare const makeWithSchema: <R>(
  send: (requests: ReadonlyArray<RpcRequest>) => Effect.Effect<R, RpcTransportError, unknown>
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

# utils

## RpcRequest (namespace)

Added in v1.0.0

### NoInput (interface)

**Signature**

```ts
export interface NoInput<M extends string> extends Tracing {
  readonly _tag: M
}
```

Added in v1.0.0

### Payload (interface)

**Signature**

```ts
export interface Payload extends Tracing {
  readonly _tag: string
  readonly input?: unknown
}
```

Added in v1.0.0

### Tracing (interface)

**Signature**

```ts
export interface Tracing {
  readonly spanName: string
  readonly traceId: string
  readonly spanId: string
  readonly sampled: boolean
}
```

Added in v1.0.0

### WithInput (interface)

**Signature**

```ts
export interface WithInput<M extends string, I> extends Tracing {
  readonly _tag: M
  readonly input: I
}
```

Added in v1.0.0

## RpcResponse (namespace)

Added in v1.0.0

### Error (interface)

**Signature**

```ts
export interface Error {
  readonly _tag: 'Error'
  error: RpcError
}
```

Added in v1.0.0

### Success (interface)

**Signature**

```ts
export interface Success {
  readonly _tag: 'Success'
  value: unknown
}
```

Added in v1.0.0
