import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://kolik.onrender.com", // your deployed backend
        changeOrigin: true,
        secure: false, // allow self-signed certs in dev
      },
    },
  },
});