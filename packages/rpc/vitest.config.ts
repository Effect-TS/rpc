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
      "@effect/rpc/test": path.join(__dirname, "test"),
      "@effect/rpc": path.join(__dirname, "src"),
    },
  },
})
