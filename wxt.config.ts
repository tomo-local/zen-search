import { defineConfig } from "wxt";
import tailwindcss from "@tailwindcss/vite";

// See https://wxt.dev/api/config.html
export default defineConfig({
  webExt: {
    disabled: true,
  },
  browser: "chrome",
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
    version: "1.7.0",
    permissions: ["tabs", "history", "activeTab", "bookmarks", "storage", "sidePanel"],
    host_permissions: [
      "https://www.google.com/complete/*",
      "https://api.bing.com/*",
      "https://ac.duckduckgo.com/*",
      "https://search.brave.com/api/*",
      "https://ac.ecosia.org/*",
      "https://search.yahoo.co.jp/sugg/*",
    ],
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
