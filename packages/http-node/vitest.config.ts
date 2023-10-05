/// <reference types="vitest" />
import * as path from "path"
import { defineConfig } from "vite"

export default defineConfig({
  test: {
    include: ["./test/**/*.test.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@effect/rpc": path.join(__dirname, "../rpc/src"),
      "@effect/rpc-http": path.join(__dirname, "../http/src"),

      "@effect/rpc-http-node/test": path.join(__dirname, "test"),
      "@effect/rpc-http-node": path.join(__dirname, "src"),
    },
  },
})
