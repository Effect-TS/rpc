---
title: Router.ts
nav_order: 5
parent: "@effect/rpc"
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
- [utils](#utils)
  - [RpcHandler (namespace)](#rpchandler-namespace)
    - [Any (type alias)](#any-type-alias)
    - [FromMethod (type alias)](#frommethod-type-alias)
    - [FromSchema (type alias)](#fromschema-type-alias)
    - [FromSetupSchema (type alias)](#fromsetupschema-type-alias)
    - [IO (type alias)](#io-type-alias)
    - [IOLayer (type alias)](#iolayer-type-alias)
    - [NoInput (type alias)](#noinput-type-alias)
  - [RpcHandlers (namespace)](#rpchandlers-namespace)
    - [Errors (type alias)](#errors-type-alias)
    - [FromService (type alias)](#fromservice-type-alias)
    - [Map (type alias)](#map-type-alias)
    - [Services (type alias)](#services-type-alias)
  - [RpcRouter (namespace)](#rpcrouter-namespace)
    - [Base (interface)](#base-interface)
    - [Options (interface)](#options-interface)
    - [WithSetup (interface)](#withsetup-interface)
    - [WithoutSetup (interface)](#withoutsetup-interface)
    - [Errors (type alias)](#errors-type-alias-1)
    - [Provide (type alias)](#provide-type-alias)
    - [Services (type alias)](#services-type-alias-1)
    - [SetupServices (type alias)](#setupservices-type-alias)

---

# handler models

## RpcHandler (type alias)

**Signature**

```ts
export type RpcHandler<R, E, I, O> =
  | RpcHandler.IO<R, E, I, O>
  | RpcHandler.IOLayer<R, E, I, O>
  | RpcHandler.NoInput<R, E, O>
```

Added in v1.0.0

# handlers models

## RpcHandlers (interface)

**Signature**

```ts
export interface RpcHandlers extends Record<string, RpcHandler.Any | { readonly handlers: RpcHandlers }> {}
```

Added in v1.0.0

# router combinators

## provideService

**Signature**

```ts
export declare const provideService: {
  <T extends Tag<any, any>>(
    tag: T,
    service: Tag.Service<T>
  ): <const Router extends RpcRouter.Base>(
    self: Router
  ) => RpcRouter.Provide<Router, Tag.Identifier<T>, never, never, []>
  <const Router extends RpcRouter.Base, T extends Tag<any, any>>(
    self: Router,
    tag: T,
    service: Tag.Service<T>
  ): RpcRouter.Provide<Router, Tag.Identifier<T>, never, never, []>
}
```

Added in v1.0.0

## provideServiceEffect

**Signature**

```ts
export declare const provideServiceEffect: {
  <const Router extends RpcRouter.Base, T extends Tag<any, any>, R, E extends RpcService.Errors<Router["schema"]>>(
    tag: T,
    effect: Effect<R, E, Tag.Service<T>>
  ): (self: Router) => RpcRouter.Provide<Router, Tag.Identifier<T>, R, E, []>
  <const Router extends RpcRouter.Base, T extends Tag<any, any>, R, E extends RpcService.Errors<Router["schema"]>>(
    self: Router,
    tag: T,
    effect: Effect<R, E, Tag.Service<T>>
  ): RpcRouter.Provide<Router, Tag.Identifier<T>, R, E, []>
}
```

Added in v1.0.0

## provideServiceSync

**Signature**

```ts
export declare const provideServiceSync: {
  <T extends Tag<any, any>>(
    tag: T,
    service: LazyArg<Tag.Service<T>>
  ): <const Router extends RpcRouter.Base>(
    self: Router
  ) => RpcRouter.Provide<Router, Tag.Identifier<T>, never, never, []>
  <Router extends RpcRouter.Base, T extends Tag<any, any>>(
    self: Router,
    tag: T,
    service: LazyArg<Tag.Service<T>>
  ): RpcRouter.Provide<Router, Tag.Identifier<T>, never, never, []>
}
```

Added in v1.0.0

# router constructors

## make

**Signature**

```ts
export declare const make: <
  const S extends RpcService.DefinitionWithId,
  const H extends RpcHandlers.FromService<S, []>
>(
  schema: S,
  handlers: H,
  options?: Partial<RpcRouter.Options>
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

# utils

## RpcHandler (namespace)

Added in v1.0.0

### Any (type alias)

**Signature**

```ts
export type Any = RpcHandler<any, any, any, any>
```

Added in v1.0.0

### FromMethod (type alias)

**Signature**

```ts
export type FromMethod<H extends RpcHandlers, M, XR, E2> = Extract<RpcHandlers.Map<H, XR, E2>, [M, any]> extends [
  infer _M,
  infer T
]
  ? T
  : never
```

Added in v1.0.0

### FromSchema (type alias)

**Signature**

```ts
export type FromSchema<C extends RpcSchema.Any> = C extends RpcSchema.IO<
  infer _IE,
  infer E,
  infer _II,
  infer I,
  infer _IO,
  infer O
>
  ? IO<any, E, I, O>
  : C extends RpcSchema.NoError<infer _II, infer I, infer _IO, infer O>
    ? IO<any, never, I, O>
    : C extends RpcSchema.NoInput<infer _IE, infer E, infer _IO, infer O>
      ? NoInput<any, E, O>
      : C extends RpcSchema.NoInputNoError<infer _IO, infer O>
        ? NoInput<any, never, O>
        : C extends RpcSchema.NoOutput<infer _IE, infer E, infer _II, infer I>
          ? IO<any, E, I, void>
          : C extends RpcSchema.NoErrorNoOutput<infer _II, infer I>
            ? IO<any, never, I, void>
            : never
```

Added in v1.0.0

### FromSetupSchema (type alias)

**Signature**

```ts
export type FromSetupSchema<C> = C extends RpcSchema.NoOutput<infer _IE, infer E, infer _II, infer I>
  ? IO<any, E, I, Context<any>> | IOLayer<any, E, I, any>
  : C extends RpcSchema.NoErrorNoOutput<infer _II, infer I>
    ? IO<any, never, I, Context<any>> | IOLayer<any, never, I, any>
    : never
```

Added in v1.0.0

### IO (type alias)

**Signature**

```ts
export type IO<R, E, I, O> = (input: I) => Effect<R, E, O>
```

Added in v1.0.0

### IOLayer (type alias)

**Signature**

```ts
export type IOLayer<R, E, I, O> = (input: I) => Layer<R, E, O>
```

Added in v1.0.0

### NoInput (type alias)

**Signature**

```ts
export type NoInput<R, E, O> = Effect<R, E, O>
```

Added in v1.0.0

## RpcHandlers (namespace)

Added in v1.0.0

### Errors (type alias)

**Signature**

```ts
export type Errors<H extends RpcHandlers, Depth extends ReadonlyArray<number> = []> = keyof H extends infer M
  ? M extends keyof H
    ? H[M] extends { readonly handlers: RpcHandlers }
      ? Depth["length"] extends 3
        ? never
        : Errors<H[M]["handlers"], [0, ...Depth]>
      : H[M] extends RpcHandler<infer _R, infer E, infer _I, infer _O>
        ? E
        : never
    : never
  : never
```

Added in v1.0.0

### FromService (type alias)

**Signature**

```ts
export type FromService<S extends RpcService.DefinitionWithId, Depth extends ReadonlyArray<number> = []> = {
  readonly [K in Extract<keyof S, string>]: S[K] extends RpcService.DefinitionWithId
    ? Depth["length"] extends 3
      ? never
      : { readonly handlers: FromService<S[K], [0, ...Depth]> }
    : K extends "__setup"
      ? RpcHandler.FromSetupSchema<S[K]>
      : S[K] extends RpcSchema.Any
        ? RpcHandler.FromSchema<S[K]>
        : never
}
```

Added in v1.0.0

### Map (type alias)

**Signature**

```ts
export type Map<
  H extends RpcHandlers,
  XR,
  E2,
  P extends string = "",
  Depth extends ReadonlyArray<number> = []
> = Extract<keyof H, string> extends infer K
  ? K extends Extract<keyof H, string>
    ? H[K] extends { readonly handlers: RpcHandlers }
      ? Depth["length"] extends 3
        ? never
        : Map<H[K]["handlers"], XR, E2, `${P}${K}.`, [0, ...Depth]>
      : H[K] extends RpcHandler.IO<infer R, infer E, infer _I, infer O>
        ? [`${P}${K}`, Effect<Exclude<R, XR>, E | E2, O>]
        : H[K] extends Effect<infer R, infer E, infer O>
          ? [`${P}${K}`, Effect<Exclude<R, XR>, E | E2, O>]
          : never
    : never
  : never
```

Added in v1.0.0

### Services (type alias)

**Signature**

```ts
export type Services<H extends RpcHandlers, Depth extends ReadonlyArray<number> = []> = keyof H extends infer M
  ? M extends keyof H
    ? H[M] extends { readonly handlers: RpcHandlers }
      ? Depth["length"] extends 3
        ? never
        : Services<H[M]["handlers"], [0, ...Depth]>
      : H[M] extends RpcHandler<infer R, infer _E, infer _I, infer _O>
        ? R
        : never
    : never
  : never
```

Added in v1.0.0

## RpcRouter (namespace)

Added in v1.0.0

### Base (interface)

**Signature**

```ts
export interface Base {
  readonly handlers: RpcHandlers
  readonly schema: RpcService.DefinitionWithId
  readonly undecoded: any
  readonly options: Options
}
```

Added in v1.0.0

### Options (interface)

**Signature**

```ts
export interface Options {
  readonly spanPrefix: string
}
```

Added in v1.0.0

### WithSetup (interface)

**Signature**

```ts
export interface WithSetup extends Base {
  readonly handlers: RpcHandlers & {
    readonly __setup: RpcHandler.Any
  }
}
```

Added in v1.0.0

### WithoutSetup (interface)

**Signature**

```ts
export interface WithoutSetup extends Base {
  readonly handlers: RpcHandlers & {
    readonly __setup?: never
  }
}
```

Added in v1.0.0

### Errors (type alias)

**Signature**

```ts
export type Errors<R extends Base> = RpcHandlers.Errors<R["handlers"]>
```

Added in v1.0.0

### Provide (type alias)

**Signature**

```ts
export type Provide<Router extends Base, XR, PR, PE, Depth extends ReadonlyArray<number> = []> = RpcRouter<
  Router["schema"],
  {
    readonly [M in keyof Router["handlers"]]: Router["handlers"][M] extends Base
      ? Depth["length"] extends 3
        ? never
        : Provide<Router["handlers"][M], XR, PR, PE, [0, ...Depth]>
      : Router["handlers"][M] extends RpcHandler.IO<infer R, infer E, infer I, infer O>
        ? RpcHandler.IO<Exclude<R, XR> | PR, E | PE, I, O>
        : Router["handlers"][M] extends RpcHandler.IOLayer<infer R, infer E, infer I, infer O>
          ? RpcHandler.IOLayer<Exclude<R, XR> | PR, E | PE, I, O>
          : Router["handlers"][M] extends RpcHandler.NoInput<infer R, infer E, infer O>
            ? RpcHandler.NoInput<Exclude<R, XR> | PR, E | PE, O>
            : never
  }
>
```

Added in v1.0.0

### Services (type alias)

**Signature**

```ts
export type Services<R extends Base> = R extends WithSetup
  ? Exclude<RpcHandlers.Services<R["handlers"]>, SetupServices<R>>
  : RpcHandlers.Services<R["handlers"]>
```

Added in v1.0.0

### SetupServices (type alias)

**Signature**

```ts
export type SetupServices<R extends WithSetup> = R["handlers"]["__setup"] extends RpcHandler.IOLayer<
  infer _R,
  infer _E,
  infer _I,
  infer O
>
  ? O
  : R["handlers"]["__setup"] extends RpcHandler.IO<infer _R, infer _E, infer _I, infer O>
    ? O extends Context<infer Env>
      ? Env
      : never
    : never
```

Added in v1.0.0
