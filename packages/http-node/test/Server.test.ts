import { pipe } from "@effect/data/Function"
import * as Effect from "@effect/io/Effect"
import * as Resolver from "@effect/rpc-http-node/Resolver"
import * as _ from "@effect/rpc-http-node/Server"
import * as Client from "@effect/rpc/Client"
import * as Router from "@effect/rpc/Router"
import * as RS from "@effect/rpc/Schema"
import * as S from "@effect/schema/Schema"
import * as Http from "node:http"
import { describe, expect, it } from "vitest"

const schema = RS.make({
  greet: {
    input: S.string,
    output: S.string,
    error: S.never,
  },

  headers: {
    output: S.record(S.string, S.string),
  },
})

const router = Router.make(schema, {
  greet: (name) => Effect.succeed(`Hello, ${name}!`),

  headers: Effect.map(_.HttpRequest, (request) =>
    Object.fromEntries(request.headers),
  ),
})

const handler = _.make(router)

describe("Server", () => {
  it("e2e", () =>
    pipe(
      Effect.acquireRelease(
        Effect.async<never, never, Http.Server>((resume) => {
          const server = Http.createServer((req, res) =>
            Effect.runFork(handler(req, res)),
          )
          server.listen(() => resume(Effect.succeed(server)))
        }),
        (server) => Effect.sync(() => server.close()),
      ),
      Effect.map((server) => {
        const port = (server.address() as any).port as number
        return Client.make(
          schema,
          Resolver.make({ url: `http://127.0.0.1:${port}` }),
        )
      }),
      Effect.flatMap((client) => client.greet("World")),
      Effect.tap((greeting) =>
        Effect.sync(() => expect(greeting).toBe("Hello, World!")),
      ),
      Effect.scoped,
      Effect.runPromise,
    ))
})
