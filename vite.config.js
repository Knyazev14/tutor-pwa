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
        description: "PWA приложение для репетитора",
        start_url: "/tutor-pwa/",
        scope: "/tutor-pwa/"
      },
    }),
  ],
  base: "/tutor-pwa/",
  server: {
    port: 5173,
    open: true,
    proxy: {
      // Прокси для всех запросов к целевому сайту
      '/api': {
        target: 'http://kattylrj.beget.tech',
        changeOrigin: true,
      
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            proxyReq.setHeader('Origin', 'http://kattylrj.beget.tech');
            proxyReq.setHeader('Referer', 'http://kattylrj.beget.tech/');
          });
        }
      },
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});