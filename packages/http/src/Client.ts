/**
 * @since 1.0.0
 */
import type * as HttpClient from "@effect/platform/Http/Client"
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
  client: HttpClient.Client.Default,
  options?: Client.RpcClientOptions
): Client.RpcClient<S, never> =>
  Client.makeWithResolver(
    schemas,
    Resolver.make(client),
    options
  )
