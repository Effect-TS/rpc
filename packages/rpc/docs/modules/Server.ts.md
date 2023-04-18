---
title: Server.ts
nav_order: 5
parent: Modules
---

## Server overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [handler](#handler)
  - [handlerRaw](#handlerraw)
  - [makeUndecodedClient](#makeundecodedclient)
  - [router](#router)
- [models](#models)
  - [RpcHandler (type alias)](#rpchandler-type-alias)
  - [RpcHandlers (interface)](#rpchandlers-interface)
  - [RpcRouter (interface)](#rpcrouter-interface)
  - [RpcUndecodedClient (type alias)](#rpcundecodedclient-type-alias)
  - [UndecodedRpcResponse (interface)](#undecodedrpcresponse-interface)

---

# constructors

## handler

**Signature**

```ts
export declare const handler: <R extends RpcRouter.Base>(
  router: R
) => (requests: unknown) => Effect<Exclude<RpcHandlers.Services<R['handlers']>, Span>, never, readonly any[]>
```

Added in v1.0.0

## handlerRaw

**Signature**

```ts
export declare const handlerRaw: <R extends RpcRouter.Base>(
  router: R
) => <Req extends any>(
  request: Req
) => Req extends { _tag: infer M } ? RpcHandler.FromMethod<R['handlers'], M, Span, any> : never
```

Added in v1.0.0

## makeUndecodedClient

**Signature**

```ts
export declare const makeUndecodedClient: <S extends any, H extends RpcHandlers.FromService<S>>(
  schemas: S,
  handlers: H,
  options: RpcRouter.Options
) => RpcUndecodedClient<H, ''>
```

Added in v1.0.0

## router

**Signature**

```ts
export declare const router: <S extends any, H extends RpcHandlers.FromService<S>>(
  schema: S,
  handlers: H,
  options?: Partial<RpcRouter.Options> | undefined
) => RpcRouter<S, H>
```

Added in v1.0.0

# models

## RpcHandler (type alias)

**Signature**

```ts
export type RpcHandler<R, E, I, O> = RpcHandler.IO<R, E, I, O> | RpcHandler.NoInput<R, E, O>
```

Added in v1.0.0

## RpcHandlers (interface)

**Signature**

```ts
export interface RpcHandlers extends Record<string, RpcHandler.Any | { handlers: RpcHandlers }> {}
```

Added in v1.0.0

## RpcRouter (interface)

**Signature**

```ts
export interface RpcRouter<S extends RpcService.DefinitionWithId, H extends RpcHandlers.FromService<S>>
  extends RpcRouter.Base {
  readonly handlers: H
  readonly schema: S
  readonly undecoded: RpcUndecodedClient<H>
}
```

Added in v1.0.0

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
