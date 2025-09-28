// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // IMPORTANT: exactly your repo name with trailing slash
  base: "/workout-tracker-v2/",
});
