// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// IMPORTANT: set to your REPO NAME with trailing slash.
// Your repo is "workout-tracker-v2"
export default defineConfig({
  plugins: [react()],
  base: "/workout-tracker-v2/",
});
