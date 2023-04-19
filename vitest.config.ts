/// <reference types="vitest" />

import babel from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

// eslint-disable-next-line @typescript-eslint/no-var-requires
const babelConfig = require("./.babel.mjs.json")

export default defineConfig({
  plugins: [babel({ babel: babelConfig })],
  test: {
    include: ["packages/*/test/**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    exclude: ["packages/*/test/utils/**/*.ts", "./test/**/*.init.ts"],
    globals: true,
  },
  resolve: {
    alias: {
      "@effect/rpc/test": path.join(__dirname, "packages/rpc/test"),
      "@effect/rpc": path.join(__dirname, "packages/rpc/src"),
      "@effect/rpc-http/test": path.join(__dirname, "packages/http/test"),
      "@effect/rpc-http": path.join(__dirname, "packages/http/src"),
    },
  },
})
