---
title: DataSource.ts
nav_order: 2
parent: Modules
---

## DataSource overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [make](#make)
  - [makeFetch](#makefetch)
- [models](#models)
  - [FetchDataSourceOptions (interface)](#fetchdatasourceoptions-interface)
  - [RpcDataSource (interface)](#rpcdatasource-interface)
  - [RpcRequest (interface)](#rpcrequest-interface)
  - [RpcResponse (type alias)](#rpcresponse-type-alias)

---

# constructors

## make

**Signature**

```ts
export declare const make: <R>(
  send: (requests: readonly RpcRequest[]) => Effect.Effect<R, any, readonly unknown[]>
) => RpcDataSource<R>
```

Added in v1.0.0

## makeFetch

**Signature**

```ts
export declare const makeFetch: (options: FetchDataSourceOptions) => RpcDataSource<never>
```

Added in v1.0.0

# models

## FetchDataSourceOptions (interface)

**Signature**

```ts
export interface FetchDataSourceOptions {
  readonly url: string
  readonly headers?: Record<string, string>
}
```

Added in v1.0.0

## RpcDataSource (interface)

**Signature**

```ts
export interface RpcDataSource<R> extends DataSource.DataSource<R, RpcRequest> {}
```

Added in v1.0.0

## RpcRequest (interface)

**Signature**

```ts
export interface RpcRequest extends Request.Request<RpcError, unknown> {
  readonly _tag: string
  readonly input: unknown
}
```

Added in v1.0.0

## RpcResponse (type alias)

**Signature**

```ts
export type RpcResponse = Either.Either<RpcError, unknown>
```

Added in v1.0.0
