import { defineConfig, mergeConfig } from "vitest/config"
import sharedConfig from "./vitest.shared"

// TODO: The workspaces feature is currently not compatible with the `@vitest/web-workers` test cases.
export default mergeConfig(sharedConfig, defineConfig({
  test: {
    include: ["packages/*/test/**/*.test.ts"]
  },
}))
