import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*{html,css,js,ico,png,svg}"],
        navigateFallback: null,
      },
      manifest: {
        theme_color: "#8936FF",
        background_color: "#2EC6FE",
        icons: [
          {
            purpose: "maskable",
            sizes: "512x512",
            src: "logo-512x512.png",
            type: "image/png",
          },
          {
            purpose: "any",
            sizes: "512x512",
            src: "logo-512x512.png",
            type: "image/png",
          },
        ],
        orientation: "any",
        display: "standalone",
        dir: "auto",
        lang: "ru",
        name: "TutorApp",
        short_name: "TutorApp",
        description: "TutorApp приложение для репетитора",
        start_url: "/tutor-pwa",
        scope: "/tutor-pwa"
      },
    }),
  ],
  base: "/tutor-pwa",
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});