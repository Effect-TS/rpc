---
title: Error.ts
nav_order: 2
parent: "@effect/rpc"
---

## Error overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [RpcDecodeFailure](#rpcdecodefailure)
  - [RpcEncodeFailure](#rpcencodefailure)
  - [RpcNotFound](#rpcnotfound)
  - [RpcTransportError](#rpctransporterror)
- [models](#models)
  - [RpcDecodeFailure (interface)](#rpcdecodefailure-interface)
  - [RpcEncodeFailure (interface)](#rpcencodefailure-interface)
  - [RpcError (type alias)](#rpcerror-type-alias)
  - [RpcNotFound (interface)](#rpcnotfound-interface)
  - [RpcTransportError (interface)](#rpctransporterror-interface)
- [schemas](#schemas)
  - [RpcError](#rpcerror)

---

# constructors

## RpcDecodeFailure

**Signature**

```ts
export declare const RpcDecodeFailure: SchemaC<
  RpcDecodeFailure,
  RpcDecodeFailure,
  { readonly errors: readonly [ParseResult.ParseErrors, ...ParseResult.ParseErrors[]] }
>
```

Added in v1.0.0

## RpcEncodeFailure

**Signature**

```ts
export declare const RpcEncodeFailure: SchemaC<
  RpcEncodeFailure,
  RpcEncodeFailure,
  { readonly errors: readonly [ParseResult.ParseErrors, ...ParseResult.ParseErrors[]] }
>
```

Added in v1.0.0

## RpcNotFound

**Signature**

```ts
export declare const RpcNotFound: SchemaC<RpcNotFound, RpcNotFound, { readonly method: string }>
```

Added in v1.0.0

## RpcTransportError

**Signature**

```ts
export declare const RpcTransportError: SchemaC<RpcTransportError, RpcTransportError, { readonly error: unknown }>
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
export interface RpcNotFound {
  readonly _tag: 'RpcNotFound'
  readonly method: string
}
```

Added in v1.0.0

## RpcTransportError (interface)

**Signature**

```ts
export interface RpcTransportError {
  readonly _tag: 'RpcTransportError'
  readonly error: unknown
}
```

Added in v1.0.0

# schemas

## RpcError

**Signature**

```ts
export declare const RpcError: Schema.Schema<
  RpcEncodeFailure | RpcTransportError | RpcNotFound | RpcDecodeFailure,
  RpcEncodeFailure | RpcTransportError | RpcNotFound | RpcDecodeFailure
>
```

Added in v1.0.0
