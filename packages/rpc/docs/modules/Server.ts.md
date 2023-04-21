---
title: Server.ts
nav_order: 6
parent: Modules
---

## Server overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [handleSingle](#handlesingle)
  - [handleSingleWithSchema](#handlesinglewithschema)
  - [handler](#handler)
  - [handlerRaw](#handlerraw)
  - [makeUndecodedClient](#makeundecodedclient)
- [models](#models)
  - [RpcUndecodedClient (type alias)](#rpcundecodedclient-type-alias)
  - [UndecodedRpcResponse (interface)](#undecodedrpcresponse-interface)

---

# constructors

## handleSingle

**Signature**

```ts
export declare const handleSingle: <R extends any>(router: R) => (request: unknown) => Effect<any, never, any>
```

Added in v1.0.0

## handleSingleWithSchema

**Signature**

```ts
export declare const handleSingleWithSchema: <R extends any>(
  router: R
) => (request: unknown) => Effect<any, never, readonly [any, any]>
```

Added in v1.0.0

## handler

**Signature**

```ts
export declare const handler: <R extends any>(router: R) => (requests: unknown) => Effect<any, never, readonly any[]>
```

Added in v1.0.0

## handlerRaw

**Signature**

```ts
export declare const handlerRaw: <R extends any>(
  router: R
) => <Req extends any>(request: Req) => Req extends { _tag: infer M } ? any : never
```

Added in v1.0.0

## makeUndecodedClient

**Signature**

```ts
export declare const makeUndecodedClient: <S extends any, H extends any>(
  schemas: S,
  handlers: H,
  options: any
) => RpcUndecodedClient<H, ''>
```

Added in v1.0.0

# models

## RpcUndecodedClient (type alias)

**Signature**

```ts
export type RpcUndecodedClient<H extends RpcHandlers, P extends string = ''> = {
  [K in Extract<keyof H, string>]: H[K] extends { handlers: RpcHandlers }
    ? RpcUndecodedClient<H[K]['handlers'], `${P}${K}.`>
    : H[K] extends RpcHandler.IO<infer R, infer E, infer I, infer O>
    ? (
        input: I
      ) => Effect<Exclude<R, Span>, E | RpcEncodeFailure | RpcDecodeFailure, UndecodedRpcResponse<`${P}${K}`, O>>
    : H[K] extends Effect<infer R, infer E, infer O>
    ? Effect<Exclude<R, Span>, E | RpcEncodeFailure | RpcDecodeFailure, UndecodedRpcResponse<`${P}${K}`, O>>
    : never
}
```

Added in v1.0.0

## UndecodedRpcResponse (interface)

**Signature**

```ts
export interface UndecodedRpcResponse<M, O> {
  readonly __rpc: M
  readonly __output: O
}
```

Added in v1.0.0
