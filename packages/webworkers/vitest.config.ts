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

      "@effect/rpc-webworkers/test": path.join(__dirname, "test"),
      "@effect/rpc-webworkers": path.join(__dirname, "src"),
    },
  },
})
