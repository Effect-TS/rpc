---
title: Schema.ts
nav_order: 6
parent: "@effect/rpc"
---

## Schema overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [withServiceError](#withserviceerror)
- [constructors](#constructors)
  - [context](#context)
  - [make](#make)
  - [makeRequestUnion](#makerequestunion)
  - [makeWith](#makewith)
- [utils](#utils)
  - [RpcRequestSchema (namespace)](#rpcrequestschema-namespace)
    - [From (type alias)](#from-type-alias)
    - [Schema (type alias)](#schema-type-alias)
    - [To (type alias)](#to-type-alias)
  - [RpcSchema (namespace)](#rpcschema-namespace)
    - [Base (interface)](#base-interface)
    - [IO (interface)](#io-interface)
    - [NoError (interface)](#noerror-interface)
    - [NoInput (interface)](#noinput-interface)
    - [NoInputNoError (interface)](#noinputnoerror-interface)
    - [Any (type alias)](#any-type-alias)
    - [Error (type alias)](#error-type-alias)
    - [Input (type alias)](#input-type-alias)
    - [Output (type alias)](#output-type-alias)
  - [RpcService (namespace)](#rpcservice-namespace)
    - [Definition (interface)](#definition-interface)
    - [DefinitionWithId (interface)](#definitionwithid-interface)
    - [DefinitionWithSetup (interface)](#definitionwithsetup-interface)
    - [DefinitionWithoutSetup (interface)](#definitionwithoutsetup-interface)
    - [Errors (type alias)](#errors-type-alias)
    - [ErrorsFrom (type alias)](#errorsfrom-type-alias)
    - [Methods (type alias)](#methods-type-alias)
    - [SetupError (type alias)](#setuperror-type-alias)
    - [SetupInput (type alias)](#setupinput-type-alias)
    - [SetupOutput (type alias)](#setupoutput-type-alias)
    - [Simplify (type alias)](#simplify-type-alias)
    - [Validate (type alias)](#validate-type-alias)
    - [WithId (type alias)](#withid-type-alias)
  - [RpcServiceErrorId](#rpcserviceerrorid)
  - [RpcServiceErrorId (type alias)](#rpcserviceerrorid-type-alias)
  - [RpcServiceId](#rpcserviceid)
  - [RpcServiceId (type alias)](#rpcserviceid-type-alias)

---

# combinators

## withServiceError

Add a service level error, which can then be used with `Router.provideServiceEffect`.

**Signature**

```ts
export declare const withServiceError: {
  <EI extends internal.Json, E>(error: Schema.Schema<EI, E>): <S extends RpcService.DefinitionWithId>(
    self: S
  ) => RpcService.WithId<S, EI | RpcService.ErrorsFrom<S>, E | RpcService.Errors<S>>
  <S extends RpcService.DefinitionWithId, EI extends internal.Json, E>(
    self: S,
    error: Schema.Schema<EI, E>
  ): RpcService.WithId<S, EI | RpcService.ErrorsFrom<S>, E | RpcService.Errors<S>>
}
```

Added in v1.0.0

# constructors

## context

**Signature**

```ts
export declare const context: <R>() => Schema.Schema<Context<R>, Context<R>>
```

Added in v1.0.0

## make

Make a RPC service schema that can be encoded and decoded from JSON.

**Signature**

```ts
export declare const make: <S>(
  schema: S
) => RpcService.Simplify<RpcService.Validate<'Schema.Json', internal.Json, S>, never, never>
```

Added in v1.0.0

## makeRequestUnion

**Signature**

```ts
export declare const makeRequestUnion: <S extends RpcService.Definition>(
  schema: S
) => Schema.Schema<RpcRequestSchema.From<S, ''>, RpcRequestSchema.To<S, ''>>
```

Added in v1.0.0

## makeWith

**Signature**

```ts
export declare const makeWith: <VL extends string, V>() => <S extends RpcService.Definition>(
  schema: S
) => RpcService.Simplify<RpcService.Validate<VL, V, S>, never, never>
```

Added in v1.0.0

# utils

## RpcRequestSchema (namespace)

Added in v1.0.0

### From (type alias)

**Signature**

```ts
export type From<S extends RpcService.Definition, P extends string = ''> = {
  readonly [K in keyof S]: K extends string
    ? S[K] extends RpcService.DefinitionWithId
      ? To<S[K], `${P}${K}.`>
      : S[K] extends RpcSchema.IO<infer _IE, infer _E, infer II, infer _I, infer _IO, infer _O>
      ? { readonly _tag: `${P}${K}`; readonly input: II }
      : S[K] extends RpcSchema.NoError<infer II, infer _I, infer _IO, infer _O>
      ? { readonly _tag: `${P}${K}`; readonly input: II }
      : S[K] extends RpcSchema.NoInput<infer _IE, infer _E, infer _IO, infer _O>
      ? { readonly _tag: `${P}${K}` }
      : S[K] extends RpcSchema.NoInputNoError<infer _IO, infer _O>
      ? { readonly _tag: `${P}${K}` }
      : never
    : never
}[keyof S]
```

Added in v1.0.0

### Schema (type alias)

**Signature**

```ts
export type Schema<S extends RpcService.Definition> = Schema.Schema<From<S>, To<S>> & {}
```

Added in v1.0.0

### To (type alias)

**Signature**

```ts
export type To<S extends RpcService.Definition, P extends string = ''> = {
  readonly [K in keyof S]: K extends string
    ? S[K] extends RpcService.DefinitionWithId
      ? To<S[K], `${P}${K}.`>
      : S[K] extends RpcSchema.IO<infer _IE, infer _E, infer _II, infer I, infer _IO, infer _O>
      ? RpcRequest.WithInput<`${P}${K}`, I>
      : S[K] extends RpcSchema.NoError<infer _II, infer I, infer _IO, infer _O>
      ? RpcRequest.WithInput<`${P}${K}`, I>
      : S[K] extends RpcSchema.NoInput<infer _IE, infer _E, infer _IO, infer _O>
      ? RpcRequest.NoInput<`${P}${K}`>
      : S[K] extends RpcSchema.NoInputNoError<infer _IO, infer _O>
      ? RpcRequest.NoInput<`${P}${K}`>
      : never
    : never
}[keyof S]
```

Added in v1.0.0

## RpcSchema (namespace)

Added in v1.0.0

### Base (interface)

**Signature**

```ts
export interface Base {
  readonly input?: Schema.Schema<any>
  readonly output: Schema.Schema<any>
  readonly error: Schema.Schema<any>
}
```

Added in v1.0.0

### IO (interface)

**Signature**

```ts
export interface IO<IE, E, II, I, IO, O> {
  input: Schema.Schema<II, I>
  output: Schema.Schema<IO, O>
  error: Schema.Schema<IE, E>
}
```

Added in v1.0.0

### NoError (interface)

**Signature**

```ts
export interface NoError<II, I, IO, O> {
  input: Schema.Schema<II, I>
  output: Schema.Schema<IO, O>
}
```

Added in v1.0.0

### NoInput (interface)

**Signature**

```ts
export interface NoInput<IE, E, IO, O> {
  output: Schema.Schema<IO, O>
  error: Schema.Schema<IE, E>
}
```

Added in v1.0.0

### NoInputNoError (interface)

**Signature**

```ts
export interface NoInputNoError<IO, O> {
  output: Schema.Schema<IO, O>
}
```

Added in v1.0.0

### Any (type alias)

**Signature**

```ts
export type Any =
  | IO<any, any, any, any, any, any>
  | NoError<any, any, any, any>
  | NoInput<any, any, any, any>
  | NoInputNoError<any, any>
```

Added in v1.0.0

### Error (type alias)

**Signature**

```ts
export type Error<S extends RpcSchema.Any> = S extends {
  readonly error: Schema.Schema<infer _I, infer A>
}
  ? A
  : never
```

Added in v1.0.0

### Input (type alias)

**Signature**

```ts
export type Input<S extends RpcSchema.Any> = S extends {
  readonly input: Schema.Schema<infer _I, infer A>
}
  ? A
  : never
```

Added in v1.0.0

### Output (type alias)

**Signature**

```ts
export type Output<S extends RpcSchema.Any> = S extends {
  readonly output: Schema.Schema<infer _I, infer A>
}
  ? A
  : never
```

Added in v1.0.0

## RpcService (namespace)

Added in v1.0.0

### Definition (interface)

**Signature**

```ts
export interface Definition extends Record<string, RpcSchema.Any | WithId<any, any, any>> {
  __setup?:
    | RpcSchema.IO<any, any, any, any, Context<any>, Context<any>>
    | RpcSchema.NoError<any, any, Context<any>, Context<any>>
}
```

Added in v1.0.0

### DefinitionWithId (interface)

**Signature**

```ts
export interface DefinitionWithId extends Definition {
  readonly [RpcServiceId]: RpcServiceId
  readonly [RpcServiceErrorId]: Schema.Schema<any, any> | Schema.Schema<never, never>
}
```

Added in v1.0.0

### DefinitionWithSetup (interface)

**Signature**

```ts
export interface DefinitionWithSetup extends DefinitionWithId {
  readonly __setup: Definition['__setup'] & {}
}
```

Added in v1.0.0

### DefinitionWithoutSetup (interface)

**Signature**

```ts
export interface DefinitionWithoutSetup extends DefinitionWithId {
  readonly __setup?: never
}
```

Added in v1.0.0

### Errors (type alias)

**Signature**

```ts
export type Errors<S extends DefinitionWithId> = Schema.Schema.To<S[RpcServiceErrorId]>
```

Added in v1.0.0

### ErrorsFrom (type alias)

**Signature**

```ts
export type ErrorsFrom<S extends DefinitionWithId> = Schema.Schema.From<S[RpcServiceErrorId]>
```

Added in v1.0.0

### Methods (type alias)

**Signature**

```ts
export type Methods<S extends DefinitionWithId, P extends string = ``> = {
  [M in keyof S]: M extends string ? (S[M] extends DefinitionWithId ? Methods<S[M], `${P}${M}.`> : `${P}${M}`) : never
}[keyof S]
```

Added in v1.0.0

### SetupError (type alias)

**Signature**

```ts
export type SetupError<S extends DefinitionWithSetup> = RpcSchema.Error<S['__setup']>
```

Added in v1.0.0

### SetupInput (type alias)

**Signature**

```ts
export type SetupInput<S extends DefinitionWithSetup> = RpcSchema.Input<S['__setup']>
```

Added in v1.0.0

### SetupOutput (type alias)

**Signature**

```ts
export type SetupOutput<S extends DefinitionWithSetup> = RpcSchema.Output<S['__setup']>
```

Added in v1.0.0

### Simplify (type alias)

**Signature**

```ts
export type Simplify<T extends RpcService.Definition, EI, E> = T extends infer S
  ? RpcService.WithId<{ readonly [K in Exclude<keyof S, RpcServiceId>]: S[K] }, EI, E>
  : never
```

Added in v1.0.0

### Validate (type alias)

**Signature**

```ts
export type Validate<VL extends string, V, S extends RpcService.Definition> = {
  readonly [K in keyof S]: K extends '__setup'
    ? S[K]
    : S[K] extends DefinitionWithId
    ? Validate<VL, V, S[K]>
    : S[K] extends RpcSchema.IO<infer IE, infer _E, infer II, infer _I, infer IO, infer _O>
    ? [IE | II | IO] extends [V]
      ? S[K]
      : `schema input does not extend ${VL}`
    : S[K] extends RpcSchema.NoError<infer II, infer _I, infer IO, infer _O>
    ? [II | IO] extends [V]
      ? S[K]
      : `schema input does not extend ${VL}`
    : S[K] extends RpcSchema.NoInput<infer IE, infer _E, infer IO, infer _O>
    ? [IE | IO] extends [V]
      ? S[K]
      : `schema input does not extend ${VL}`
    : S[K] extends RpcSchema.NoInputNoError<infer IO, infer _O>
    ? [IO] extends [V]
      ? S[K]
      : `schema input does not extend ${VL}`
    : S[K]
}
```

Added in v1.0.0

### WithId (type alias)

**Signature**

```ts
export type WithId<S extends RpcService.Definition, EI, E> = S & {
  readonly [RpcServiceId]: RpcServiceId
  readonly [RpcServiceErrorId]: Schema.Schema<EI, E>
}
```

Added in v1.0.0

## RpcServiceErrorId

**Signature**

```ts
export declare const RpcServiceErrorId: typeof RpcServiceErrorId
```

Added in v1.0.0

## RpcServiceErrorId (type alias)

**Signature**

```ts
export type RpcServiceErrorId = typeof RpcServiceErrorId
```

Added in v1.0.0

## RpcServiceId

**Signature**

```ts
export declare const RpcServiceId: typeof RpcServiceId
```

Added in v1.0.0

## RpcServiceId (type alias)

**Signature**

```ts
export type RpcServiceId = typeof RpcServiceId
```

Added in v1.0.0
