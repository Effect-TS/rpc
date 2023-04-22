/// <reference types="vitest" />
import path from "node:path"
import { defineConfig } from "vite"

export default defineConfig({
  resolve: {
    alias: {
      "@effect/rpc": path.join(__dirname, "../rpc/src"),
      "@effect/rpc-webworkers": path.join(__dirname, "../webworkers/src"),
    },
  },
})
