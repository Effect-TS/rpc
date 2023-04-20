/// <reference types="vitest" />
import babel from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const babelConfig = require("../../.babel.mjs.json")

export default defineConfig({
  plugins: [babel({ babel: babelConfig })],
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
