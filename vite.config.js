import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [react(), eslint()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules/firebase")) {
            return "firebase";
          }
          if (id.includes("node_modules")) {
            return "vendor";
          }
        },
      },
      plugins: [
        visualizer({
          open: true,
          filename: "dist/stats.html",
          gzipSize: true,
          brotliSize: true,
        }),
      ],
    },
  },
});
