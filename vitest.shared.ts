import * as path from "path"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      "@effect/rpc/test": path.join(__dirname, "packages/rpc/test"),
      "@effect/rpc": path.join(__dirname, "packages/rpc/src"),
      "@effect/rpc-http/test": path.join(__dirname, "packages/http/test"),
      "@effect/rpc-http": path.join(__dirname, "packages/http/src"),
      "@effect/rpc-http-node/test": path.join(__dirname, "packages/http-node/test"),
      "@effect/rpc-http-node": path.join(__dirname, "packages/http-node/src"),
      "@effect/rpc-nextjs/test": path.join(__dirname, "packages/nextjs/test"),
      "@effect/rpc-nextjs": path.join(__dirname, "packages/nextjs/src"),
      "@effect/rpc-workers/test": path.join(__dirname, "packages/workers/test"),
      "@effect/rpc-workers": path.join(__dirname, "packages/workers/src")
    }
  }
})
