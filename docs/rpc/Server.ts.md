---
title: Server.ts
nav_order: 8
parent: "@effect/rpc"
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
- [utils](#utils)
  - [RpcServer (interface)](#rpcserver-interface)
  - [RpcServerSingle (interface)](#rpcserversingle-interface)
  - [RpcServerSingleWithSchema (interface)](#rpcserversinglewithschema-interface)

---

# constructors

## handleSingle

**Signature**

```ts
export declare const handleSingle: {
  <const R extends RpcRouter.WithSetup>(
    router: R
  ): Effect<
    Scope,
    never,
    (
      request: unknown
    ) => Effect<Exclude<RpcHandlers.Services<R["handlers"], []>, RpcRouter.SetupServices<R>>, never, RpcResponse>
  >
  <R extends RpcRouter.WithoutSetup>(
    router: R
  ): (request: unknown) => Effect<RpcHandlers.Services<R["handlers"], []>, never, RpcResponse>
}
```

Added in v1.0.0

## handleSingleWithSchema

**Signature**

```ts
export declare const handleSingleWithSchema: {
  <const R extends RpcRouter.WithSetup>(
    router: R
  ): Effect<
    Scope,
    never,
    (
      request: unknown
    ) => Effect<
      Exclude<RpcHandlers.Services<R["handlers"], []>, RpcRouter.SetupServices<R>>,
      never,
      readonly [RpcResponse, Option<RpcSchema.Base>]
    >
  >
  <R extends RpcRouter.WithoutSetup>(
    router: R
  ): (
    request: unknown
  ) => Effect<RpcHandlers.Services<R["handlers"], []>, never, readonly [RpcResponse, Option<RpcSchema.Base>]>
}
```

Added in v1.0.0

## handler

**Signature**

```ts
export declare const handler: {
  <const R extends RpcRouter.WithSetup>(
    router: R
  ): Effect<
    Scope,
    never,
    (
      request: unknown
    ) => Effect<
      Exclude<RpcHandlers.Services<R["handlers"], []>, RpcRouter.SetupServices<R>>,
      never,
      readonly RpcResponse[]
    >
  >
  <const R extends RpcRouter.WithoutSetup>(
    router: R
  ): (request: unknown) => Effect<RpcHandlers.Services<R["handlers"], []>, never, readonly RpcResponse[]>
}
```

Added in v1.0.0

## handlerRaw

**Signature**

```ts
export declare const handlerRaw: <const R extends RpcRouter.Base>(
  router: R
) => <Req extends RpcRequestSchema.To<R["schema"], "", []>>(
  request: Req
) => Req extends { _tag: infer M } ? RpcHandler.FromMethod<R["handlers"], M, never, RpcEncodeFailure> : never
```

Added in v1.0.0

## makeUndecodedClient

**Signature**

```ts
export declare const makeUndecodedClient: <
  const S extends RpcService.DefinitionWithId,
  const H extends RpcHandlers.FromService<S, []>
>(
  schemas: S,
  handlers: H,
  options: RpcRouter.Options
) => RpcUndecodedClient<H, "", []>
```

Added in v1.0.0

# models

## RpcUndecodedClient (type alias)

**Signature**

```ts
export type RpcUndecodedClient<
  H extends RpcHandlers,
  P extends string = "",
  Depth extends ReadonlyArray<number> = []
> = {
  readonly [K in Extract<keyof H, string>]: H[K] extends {
    readonly handlers: RpcHandlers
  }
    ? Depth["length"] extends 3
      ? never
      : RpcUndecodedClient<H[K]["handlers"], `${P}${K}.`, [0, ...Depth]>
    : H[K] extends RpcHandler.IO<infer R, infer E, infer I, infer O>
      ? (input: I) => Effect<R, E | RpcEncodeFailure | RpcDecodeFailure, UndecodedRpcResponse<`${P}${K}`, O>>
      : H[K] extends Effect<infer R, infer E, infer O>
        ? Effect<R, E | RpcEncodeFailure | RpcDecodeFailure, UndecodedRpcResponse<`${P}${K}`, O>>
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

# utils

## RpcServer (interface)

**Signature**

```ts
export interface RpcServer {
  (request: unknown): Effect<never, never, ReadonlyArray<RpcResponse>>
}
```

Added in v1.0.0

## RpcServerSingle (interface)

**Signature**

```ts
export interface RpcServerSingle {
  (request: unknown): Effect<never, never, RpcResponse>
}
```

Added in v1.0.0

## RpcServerSingleWithSchema (interface)

**Signature**

```ts
export interface RpcServerSingleWithSchema {
  (request: unknown): Effect<never, never, readonly [RpcResponse, Option<RpcSchema.Base>]>
}
```

Added in v1.0.0
