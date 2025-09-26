import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// CHANGE this to your repository name
const repo = "workout-tracker-v2";

export default defineConfig({
  plugins: [react()],
  base: `/${repo}/`,
  build: { outDir: "dist" }
});
