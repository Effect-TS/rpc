---
title: Resolver.ts
nav_order: 3
parent: "@effect/rpc-http"
---

## Resolver overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [make](#make)
- [errors](#errors)
  - [RpcFetchError](#rpcfetcherror)
  - [RpcFetchError (interface)](#rpcfetcherror-interface)
- [models](#models)
  - [FetchResolverOptions (interface)](#fetchresolveroptions-interface)

---

# constructors

## make

**Signature**

```ts
export declare const make: (options: FetchResolverOptions) => RpcResolver<never>
```

Added in v1.0.0

# errors

## RpcFetchError

**Signature**

```ts
export declare const RpcFetchError: SchemaC<
  RpcFetchError,
  RpcFetchError,
  { readonly reason: 'FetchError' | 'JsonDecodeError'; readonly error: unknown }
>
```

Added in v1.0.0

## RpcFetchError (interface)

**Signature**

```ts
export interface RpcFetchError {
  readonly _tag: 'RpcFetchError'
  readonly reason: 'FetchError' | 'JsonDecodeError'
  readonly error: unknown
}
```

Added in v1.0.0

# models

## FetchResolverOptions (interface)

**Signature**

```ts
export interface FetchResolverOptions {
  readonly url: string
  readonly init?: Omit<RequestInit, 'signal' | 'body' | 'method'>
}
```

Added in v1.0.0
