---
title: Error.ts
nav_order: 3
parent: Modules
---

## Error overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [RpcDecodeFailure](#rpcdecodefailure)
  - [RpcEncodeFailure](#rpcencodefailure)
  - [RpcError](#rpcerror)
  - [RpcNotFound](#rpcnotfound)
  - [RpcTransportError](#rpctransporterror)
- [models](#models)
  - [RpcDecodeFailure (interface)](#rpcdecodefailure-interface)
  - [RpcEncodeFailure (interface)](#rpcencodefailure-interface)
  - [RpcError (type alias)](#rpcerror-type-alias)
  - [RpcNotFound (interface)](#rpcnotfound-interface)
  - [RpcTransportError (interface)](#rpctransporterror-interface)

---

# constructors

## RpcDecodeFailure

**Signature**

```ts
export declare const RpcDecodeFailure: Schema.Schema<
  { readonly _tag: 'RpcDecodeFailure'; readonly errors: readonly [any, ...any[]] },
  { readonly _tag: 'RpcDecodeFailure'; readonly errors: readonly [any, ...any[]] }
>
```

Added in v1.0.0

## RpcEncodeFailure

**Signature**

```ts
export declare const RpcEncodeFailure: Schema.Schema<
  { readonly _tag: 'RpcEncodeFailure'; readonly errors: readonly [any, ...any[]] },
  { readonly _tag: 'RpcEncodeFailure'; readonly errors: readonly [any, ...any[]] }
>
```

Added in v1.0.0

## RpcError

**Signature**

```ts
export declare const RpcError: Schema.Schema<
  | { readonly _tag: 'RpcNotFound'; readonly method: string }
  | { readonly _tag: 'RpcDecodeFailure'; readonly errors: readonly [any, ...any[]] }
  | { readonly _tag: 'RpcTransportError'; readonly error: unknown }
  | { readonly _tag: 'RpcEncodeFailure'; readonly errors: readonly [any, ...any[]] },
  | { readonly _tag: 'RpcNotFound'; readonly method: string }
  | { readonly _tag: 'RpcDecodeFailure'; readonly errors: readonly [any, ...any[]] }
  | { readonly _tag: 'RpcTransportError'; readonly error: unknown }
  | { readonly _tag: 'RpcEncodeFailure'; readonly errors: readonly [any, ...any[]] }
>
```

Added in v1.0.0

## RpcNotFound

**Signature**

```ts
export declare const RpcNotFound: Schema.Schema<
  { readonly _tag: 'RpcNotFound'; readonly method: string },
  { readonly _tag: 'RpcNotFound'; readonly method: string }
>
```

Added in v1.0.0

## RpcTransportError

**Signature**

```ts
export declare const RpcTransportError: Schema.Schema<
  { readonly _tag: 'RpcTransportError'; readonly error: unknown },
  { readonly _tag: 'RpcTransportError'; readonly error: unknown }
>
```

Added in v1.0.0

# models

## RpcDecodeFailure (interface)

**Signature**

```ts
export interface RpcDecodeFailure {
  readonly _tag: 'RpcDecodeFailure'
  readonly errors: ROA.NonEmptyReadonlyArray<ParseResult.ParseErrors>
}
```

Added in v1.0.0

## RpcEncodeFailure (interface)

**Signature**

```ts
export interface RpcEncodeFailure {
  readonly _tag: 'RpcEncodeFailure'
  readonly errors: ROA.NonEmptyReadonlyArray<ParseResult.ParseErrors>
}
```

Added in v1.0.0

## RpcError (type alias)

**Signature**

```ts
export type RpcError = RpcDecodeFailure | RpcEncodeFailure | RpcNotFound | RpcTransportError
```

Added in v1.0.0

## RpcNotFound (interface)

**Signature**

```ts
export interface RpcNotFound extends Schema.To<typeof RpcNotFound> {}
```

Added in v1.0.0

## RpcTransportError (interface)

**Signature**

```ts
export interface RpcTransportError extends Schema.To<typeof RpcTransportError> {}
```

Added in v1.0.0
