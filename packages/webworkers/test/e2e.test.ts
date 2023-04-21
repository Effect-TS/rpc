import "@vitest/web-worker"
import { describe, it } from "vitest"

describe("e2e", () => {
  it("works", () =>
    new Promise<void>((resolve) => {
      const worker = new Worker(new URL("./e2e/worker.ts", import.meta.url))
      worker.onmessage = (e) => {
        console.log(e)
      }
      worker.onmessage = (e) => {
        console.log(e.data)
        expect(e.data).toBe("hello")
        worker.terminate()
        resolve()
      }
      worker.postMessage("hello")
    }))
})
