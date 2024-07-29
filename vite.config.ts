import { resolve } from "path";
import { defineConfig } from "vitest/config";
import dts from "vite-plugin-dts";

export default defineConfig({
  test: {
    globals: true,
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, "src/index.ts"),
      name: "timed-map",
      fileName: "index",
    },
  },
  // to merge all declarations into one file
  plugins: [dts({ rollupTypes: true })],
});
