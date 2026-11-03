import { svelte } from "@sveltejs/vite-plugin-svelte";
import { minify } from "terser";
import { defineConfig, type Plugin } from "vite";

const browserBundleName = "content-widgets";

// See https://github.com/vitejs/vite/issues/6555
const minifyBundle = (): Plugin => ({
  name: "minify-bundle",
  async generateBundle(_, bundle) {
    for (const asset of Object.values(bundle)) {
      if (asset.type === "chunk") {
        const code = (await minify(asset.code, { sourceMap: false })).code;
        if (code) {
          asset.code = code;
        }
      }
    }
  },
});

export default defineConfig({
  experimental: {
    enableNativePlugin: true,
  },
  plugins: [
    svelte(),
    minifyBundle(),
  ],
  build: {
    lib: {
      entry: "src/index.ts",
      name: "XhhaoComContentWidgets",
      fileName: browserBundleName,
      formats: ["es", "iife"],
    },
    cssFileName: browserBundleName,
    rollupOptions: {
      output: {
        extend: true,
      },
    },
  },
});
