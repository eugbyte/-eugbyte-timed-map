import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
  },
  build: {
    rollupOptions : {
      // overwrite default .html entry
      input : '/src/index.ts',
    },
  }
});
