import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*{html,css,js,ico,png,svg}"],
      },
      manifest: {
        theme_color: "#8936FF",
        background_color: "#2EC6FE",
        icons: [
          {
            purpose: "maskable",
            sizes: "512x512",
            src: "stalker.png",
            type: "image/png",
          },
          {
            purpose: "any",
            sizes: "512x512",
            src: "stalker.png",
            type: "image/png",
          },
        ],
        orientation: "any",
        display: "standalone",
        dir: "auto",
        lang: "ru",
        name: "sTALKER",
        short_name: "ST",
      },
    }),
  ],
  base: "/tutor-pwa/",
});
