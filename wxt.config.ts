import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  webExt: {
    disabled: true,
  },
  modules: ["@wxt-dev/module-react", "@wxt-dev/auto-icons", "@wxt-dev/i18n/module"],
  vite: () => ({
    plugins: [tailwindcss()],
  }),
  srcDir: "src",
  outDir: "dist",
  manifest: {
    name: "Zen Search",
    default_locale: "en",
    current_locale: "en",
    description: "Search your bookmarks and history",
    version: "1.5.2",
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
