import { Tag } from "@effect/data/Context"
import type { LazyArg } from "@effect/data/Function"
import { pipe } from "@effect/data/Function"
import * as Deferred from "@effect/io/Deferred"
import * as Effect from "@effect/io/Effect"
import * as Layer from "@effect/io/Layer"
import * as Pool from "@effect/io/Pool"
import type * as WWResolver from "@effect/rpc-webworkers/Resolver"
import * as schema from "@effect/rpc-webworkers/Schema"
import type { RpcTransportError } from "@effect/rpc/Error"
import * as Resolver from "@effect/rpc/Resolver"
import type { Exit } from "@effect/io/Exit"
import * as Queue from "@effect/io/Queue"

/** @internal */
export const WebWorkerResolver = Tag<
  WWResolver.WebWorkerResolver,
  Resolver.RpcResolver<never>
>()

const defaultSize = Effect.sync(() => navigator.hardwareConcurrency)

const makeWorker = (evaluate: LazyArg<Worker>) =>
  Effect.acquireRelease(Effect.sync(evaluate), (worker) =>
    Effect.sync(() => worker.terminate()),
  )

const test = <E, I, O>(
  evaluate: LazyArg<Worker>,
  onError: (error: ErrorEvent) => E,
  permits: number,
) =>
  Effect.gen(function* ($) {
    const worker = yield* $(
      Effect.acquireRelease(Effect.sync(evaluate), (worker) =>
        Effect.sync(() => worker.terminate()),
      ),
    )

    let idCounter = 0

    const semaphore = yield* $(Effect.makeSemaphore(permits))
    const outbound = yield* $(Queue.unbounded<readonly [number, I]>())
    const requestMap = new Map<number, Deferred.Deferred<E, O>>()

    const handleExit = (exit: Exit<E, O>) =>
      Effect.allDiscard(
        [...requestMap.values()].map((_) => Deferred.complete(_, exit)),
      )

    const send = (request: I) =>
      pipe(
        Deferred.make<E, O>(),
        Effect.flatMap((deferred) =>
          Effect.suspend(() => {
            const id = idCounter++
            requestMap.set(id, deferred)
            return Effect.zipRight(
              Queue.offer(outbound, [id, request]),
              Deferred.await(deferred),
            )
          }),
        ),
        semaphore.withPermits(1),
      )

    const run = Effect.asyncInterrupt<never, E, never>((resume) => {
      const controller = new AbortController()

      return Effect.sync(() => controller.abort())
    })
  })

/** @internal */
export const WebWorkerResolverLive = (
  evaluate: LazyArg<Worker>,
  { size = defaultSize }: { size?: Effect.Effect<never, never, number> } = {},
) =>
  Layer.scoped(
    WebWorkerResolver,
    pipe(
      Effect.flatMap(size, (size) => Pool.make(makeWorker(evaluate), size)),
      Effect.map(make),
    ),
  )

/** @internal */
export const make = (
  pool: Pool.Pool<never, Worker>,
): Resolver.RpcResolver<never> =>
  Resolver.makeSingleWithSchema((request) =>
    pipe(
      pool.get(),
      Effect.flatMap((worker) =>
        pipe(
          Effect.asyncInterrupt<never, RpcTransportError, unknown>((resume) => {
            const controller = new AbortController()
            const signal = controller.signal

            const onError = (error: ErrorEvent) => {
              resume(Effect.fail({ _tag: "RpcTransportError", error }))
            }
            worker.addEventListener("error", onError, { once: true, signal })
            worker.addEventListener(
              "message",
              (event) => {
                worker.removeEventListener("error", onError)
                resume(Effect.succeed(event.data))
              },
              { once: true, signal },
            )

            const transfer =
              "input" in request.schema
                ? schema.getTransferables(
                    request.schema.input,
                    request.payload.input,
                  )
                : []
            worker.postMessage(request.payload, { transfer })

            return Effect.sync(() => controller.abort())
          }),
          Effect.tapErrorCause(() => pool.invalidate(worker)),
        ),
      ),
      Effect.scoped,
    ),
  )
