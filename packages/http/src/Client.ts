/**
 * @since 1.0.0
 */
import * as Client from "@effect/rpc/Client"
import type { RpcService } from "@effect/rpc/Schema"
import * as Resolver from "./Resolver"

/**
 * @since 1.0.0
 */
export * from "@effect/rpc/Client"

/**
 * @category constructors
 * @since 1.0.0
 */
export const make = <S extends RpcService.DefinitionWithoutSetup>(
  schemas: S,
  options: Client.RpcClientOptions & Resolver.FetchResolverOptions
): Client.RpcClient<S, never> =>
  Client.makeWithResolver(
    schemas,
    Resolver.make(options),
    options
  )
