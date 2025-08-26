import path from "path";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), imagetools()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  /**
   * Dev server proxy:
   * We intentionally proxy /api -> backend to avoid using a raw http://local-api.dev:8080 URL in the browser.
   * Reason: .dev TLD is on the HSTS preload list; the browser force-upgrades to HTTPS causing ERR_NAME_NOT_RESOLVED
   * when backend serves only HTTP. With a proxy we can keep frontend at http://localhost and still reach backend.
   *
   * Change target below if backend host/port changes. You can also override via env VITE_API_PROXY_TARGET.
   */
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_PROXY_TARGET || "http://localhost:8080",
        changeOrigin: true,
        // keep /api prefix as-is so /api/v1/... maps directly
        // If backend does not include /api prefix internally, set rewrite: p => p.replace(/^\/api/, '')
      },
    },
  },
});
