---
title: Resolver.ts
nav_order: 1
parent: Modules
---

## Resolver overview

Added in v1.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [constructors](#constructors)
  - [make](#make)
- [layers](#layers)
  - [WebWorkerResolverLive](#webworkerresolverlive)
- [tags](#tags)
  - [WebWorkerResolver](#webworkerresolver)
  - [WebWorkerResolver (interface)](#webworkerresolver-interface)

---

# constructors

## make

**Signature**

```ts
export declare const make: (pool: Pool<never, Worker>) => Resolver.RpcResolver<never>
```

Added in v1.0.0

# layers

## WebWorkerResolverLive

**Signature**

```ts
export declare const WebWorkerResolverLive: (
  evaluate: LazyArg<Worker>,
  { size }?: { size?: Effect.Effect<never, never, number> | undefined } | undefined
) => Layer.Layer<never, never, WebWorkerResolver>
```

Added in v1.0.0

# tags

## WebWorkerResolver

**Signature**

```ts
export declare const WebWorkerResolver: Tag<WebWorkerResolver, Resolver.RpcResolver<never>>
```

Added in v1.0.0

## WebWorkerResolver (interface)

**Signature**

```ts
export interface WebWorkerResolver {
  readonly _: unique symbol
}
```

Added in v1.0.0
