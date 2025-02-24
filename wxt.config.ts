import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  runner: {
    disabled: true,
  },
  extensionApi: "chrome",
  modules: ["@wxt-dev/module-react"],
  srcDir: "src",
  outDir: "dist",
  manifest: {
    permissions: ["tabs", "history", "activeTab", "bookmarks"],
    commands: {
      openPopup: {
        suggested_key: {
          default: "Ctrl+T",
          mac: "Command+T",
        },
        description: "Open the popup",
      },
    },
  },
});
