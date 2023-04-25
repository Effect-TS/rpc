---
title: Router.ts
nav_order: 4
parent: @effect/rpc
---

## Router overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [handler models](#handler-models)
  - [RpcHandler (type alias)](#rpchandler-type-alias)
- [handlers models](#handlers-models)
  - [RpcHandlers (interface)](#rpchandlers-interface)
- [router combinators](#router-combinators)
  - [provideService](#provideservice)
  - [provideServiceEffect](#provideserviceeffect)
  - [provideServiceSync](#provideservicesync)
- [router constructors](#router-constructors)
  - [make](#make)
- [router models](#router-models)
  - [RpcRouter (interface)](#rpcrouter-interface)

---

# handler models

## RpcHandler (type alias)

**Signature**

```ts
export type RpcHandler<R, E, I, O> = RpcHandler.IO<R, E, I, O> | RpcHandler.NoInput<R, E, O>
```

Added in v1.0.0

# handlers models

## RpcHandlers (interface)

**Signature**

```ts
export interface RpcHandlers extends Record<string, RpcHandler.Any | { handlers: RpcHandlers }> {}
```

Added in v1.0.0

# router combinators

## provideService

**Signature**

```ts
export declare const provideService: {
  <T extends Tag<any, any>>(tag: T, service: Tag.Service<T>): <Router extends RpcRouter.Base>(
    self: Router
  ) => RpcRouter.Provide<Router, Tag.Identifier<T>, never, never>
  <Router extends RpcRouter.Base, T extends Tag<any, any>>(
    self: Router,
    tag: T,
    service: Tag.Service<T>
  ): RpcRouter.Provide<Router, Tag.Identifier<T>, never, never>
}
```

Added in v1.0.0

## provideServiceEffect

**Signature**

```ts
export declare const provideServiceEffect: {
  <Router extends RpcRouter.Base, T extends Tag<any, any>, R, E extends any>(
    tag: T,
    effect: Effect<R, E, Tag.Service<T>>
  ): (self: Router) => RpcRouter.Provide<Router, Tag.Identifier<T>, R, E>
  <Router extends RpcRouter.Base, T extends Tag<any, any>, R, E extends any>(
    self: Router,
    tag: T,
    effect: Effect<R, E, Tag.Service<T>>
  ): RpcRouter.Provide<Router, Tag.Identifier<T>, R, E>
}
```

Added in v1.0.0

## provideServiceSync

**Signature**

```ts
export declare const provideServiceSync: {
  <T extends Tag<any, any>>(tag: T, service: LazyArg<Tag.Service<T>>): <Router extends RpcRouter.Base>(
    self: Router
  ) => RpcRouter.Provide<Router, Tag.Identifier<T>, never, never>
  <Router extends RpcRouter.Base, T extends Tag<any, any>>(
    self: Router,
    tag: T,
    service: LazyArg<Tag.Service<T>>
  ): RpcRouter.Provide<Router, Tag.Identifier<T>, never, never>
}
```

Added in v1.0.0

# router constructors

## make

**Signature**

```ts
export declare const make: <S extends any, H extends RpcHandlers.FromService<S>>(
  schema: S,
  handlers: H,
  options?: Partial<RpcRouter.Options> | undefined
) => RpcRouter<S, H>
```

Added in v1.0.0

# router models

## RpcRouter (interface)

**Signature**

```ts
export interface RpcRouter<S extends RpcService.DefinitionWithId, H extends RpcHandlers> extends RpcRouter.Base {
  readonly handlers: H
  readonly schema: S
  readonly undecoded: RpcUndecodedClient<H>
}
```

Added in v1.0.0
