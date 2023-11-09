import { defineConfig, mergeConfig } from "vitest/config"
import sharedConfig from "../../vitest.shared"

export default mergeConfig(
  sharedConfig,
  defineConfig({
    test: {
      include: ["./test/**/*.test.ts"]
    },
    optimizeDeps: {
      exclude: ["@vite/client", "@vite/env", "vite", "vite-node"]
    }
  })
)
