/// <reference types="vitest" />
import * as path from "path"
import { defineConfig } from "vite"

export default defineConfig({
  test: {
    include: ["./test/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["./test/utils/**/*.ts", "./test/**/*.init.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@effect/rpc": path.join(__dirname, "../rpc/src"),

      "@effect/rpc-http/test": path.join(__dirname, "test"),
      "@effect/rpc-http": path.join(__dirname, "src"),
    },
  },
})
