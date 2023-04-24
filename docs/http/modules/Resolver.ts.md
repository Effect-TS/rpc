---
title: Resolver.ts
nav_order: 3
parent: Modules
---

## Resolver overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [make](#make)
- [models](#models)
  - [FetchResolverOptions (interface)](#fetchresolveroptions-interface)
  - [RpcFetchError (interface)](#rpcfetcherror-interface)

---

# constructors

## make

**Signature**

```ts
export declare const make: (options: FetchResolverOptions) => RpcResolver<never>
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
