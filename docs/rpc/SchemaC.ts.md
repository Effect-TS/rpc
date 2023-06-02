---
title: SchemaC.ts
nav_order: 6
parent: "@effect/rpc"
---

## SchemaC overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [combinators](#combinators)
  - [withConstructor](#withconstructor)
  - [withConstructorDataTagged](#withconstructordatatagged)
  - [withConstructorSelf](#withconstructorself)
  - [withConstructorTagged](#withconstructortagged)
  - [withTo](#withto)
- [models](#models)
  - [SchemaC (interface)](#schemac-interface)

---

# combinators

## withConstructor

**Signature**

```ts
export declare const withConstructor: {
  <A, C>(f: (input: C) => A): <I>(self: Schema.Schema<I, A>) => SchemaC<I, A, C>
  <I, A, C>(self: Schema.Schema<I, A>, f: (input: C) => A): SchemaC<I, A, C>
}
```

Added in v1.0.0

## withConstructorDataTagged

**Signature**

```ts
export declare const withConstructorDataTagged: {
  <A extends { readonly _tag: string }>(tag: A['_tag']): <I>(
    self: Schema.Schema<I, A>
  ) => SchemaC<I, Data.Data<A>, Omit<A, '_tag'>>
  <I extends Record<string, any>, A extends { readonly _tag: string }>(
    self: Schema.Schema<I, A>,
    tag: A['_tag']
  ): SchemaC<I, Data.Data<A>, Omit<A, '_tag'>>
}
```

Added in v1.0.0

## withConstructorSelf

**Signature**

```ts
export declare const withConstructorSelf: <I, A>(self: Schema.Schema<I, A>) => SchemaC<I, A, A>
```

Added in v1.0.0

## withConstructorTagged

**Signature**

```ts
export declare const withConstructorTagged: {
  <A extends { readonly _tag: string }>(tag: A['_tag']): <I>(
    self: Schema.Schema<I, A>
  ) => SchemaC<I, A, Omit<A, '_tag'>>
  <I, A extends { readonly _tag: string }>(self: Schema.Schema<I, A>, tag: A['_tag']): SchemaC<I, A, Omit<A, '_tag'>>
}
```

Added in v1.0.0

## withTo

**Signature**

```ts
export declare const withTo: <A>() => <I, X extends A, C>(self: SchemaC<I, X, C>) => SchemaC<I, A, C>
```

Added in v1.0.0

# models

## SchemaC (interface)

**Signature**

```ts
export interface SchemaC<I, A, C> extends Schema.Schema<I, A> {
  (input: C): A
  readonly either: (input: C) => Either<ParseError, A>
  readonly effect: (input: C) => Effect<never, ParseError, A>
  readonly option: (input: C) => Option<A>
}
```

Added in v1.0.0
