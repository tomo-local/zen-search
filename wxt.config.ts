import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  webExt: {
    disabled: true,
  },
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons"],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  srcDir: "src",
  outDir: "dist",
  manifest: {
    name: "Zen Search",
    description: "Search your bookmarks and history",
    version: "1.3.1",
    permissions: ["tabs", "history", "activeTab", "bookmarks", "storage"],
    commands: {
      OPEN_POPUP: {
        suggested_key: {
          default: "Ctrl+T",
          mac: "Command+T",
        },
        description: "Open The Popup",
      },
    },
  },
});
