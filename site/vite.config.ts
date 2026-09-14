import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

const repo = process.env.GITHUB_REPOSITORY?.toLowerCase();
const repoName = repo ? repo.split("/")[1] : "underwrite";
const base = process.env.VITE_BASE ?? `/${repoName}/`;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  base,
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    target: "es2022",
    cssCodeSplit: true,
    sourcemap: false,
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ["framer-motion", "lenis"],
          icons: ["lucide-react"],
        },
      },
    },
  },
});