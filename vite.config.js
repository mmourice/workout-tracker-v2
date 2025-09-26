import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  base: "/workout-tracker-v2/", // <-- REQUIRED for GitHub Pages (owner.github.io/repo)
  resolve: { alias: { "@": path.resolve(__dirname, "src") } }
});
