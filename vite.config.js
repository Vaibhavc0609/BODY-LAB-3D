import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    allowedHosts: true,
    cors: true,
  },
  preview: {
    host: true,
    allowedHosts: true,
    cors: true,
  },
  build: {
    chunkSizeWarningLimit: 900,
    rolldownOptions: {
      output: {
        manualChunks(id) {
          const norm = id.replace(/\\/g, "/");
          if (norm.includes("node_modules/three/examples/")) return "three-examples";
          if (norm.includes("node_modules/three/")) return "three-core";
          if (norm.includes("node_modules/@react-three/")) return "react-three";
          if (norm.includes("node_modules/")) return "vendor";
        },
      },
    },
  },
});
