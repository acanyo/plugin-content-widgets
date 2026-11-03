import { svelte } from "@sveltejs/vite-plugin-svelte";
import { cpSync, rmSync } from "fs";
import { fileURLToPath } from "url";
import { defineConfig, type Plugin } from "vite";

const haloStaticDir = fileURLToPath(new URL("../../src/main/resources/static", import.meta.url));
const browserDistDir = "dist-browser";

// 同步浏览器端产物到 Halo 插件静态资源目录，并清理历史全量产物
const copyBundleToHaloStatic = (): Plugin => ({
  name: "copy-bundle-to-halo-static",
  closeBundle() {
    rmSync(`${haloStaticDir}/content-widgets.iife.js`, { force: true });
    rmSync(`${haloStaticDir}/content-widgets.css`, { force: true });
    rmSync(`${haloStaticDir}/content-widgets-loader.js`, { force: true });
    rmSync(`${haloStaticDir}/chunks`, { recursive: true, force: true });
    cpSync(browserDistDir, haloStaticDir, { recursive: true });
  },
});

export default defineConfig({
  experimental: {
    enableNativePlugin: true,
  },
  plugins: [svelte(), copyBundleToHaloStatic()],
  base: "./",
  build: {
    outDir: browserDistDir,
    cssCodeSplit: true,
    rollupOptions: {
      input: "src/loader/index.ts",
      output: {
        format: "es",
        entryFileNames: "content-widgets-loader.js",
        chunkFileNames: "chunks/[name]-[hash].js",
        assetFileNames: "chunks/[name]-[hash][extname]",
      },
    },
  },
});
