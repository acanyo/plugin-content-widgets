import { defineConfig } from "vite";

export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: "src/presets.ts",
      formats: ["es"],
      fileName: () => "widget-presets.js",
    },
  },
});
