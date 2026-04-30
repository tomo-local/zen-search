import { storageService } from "@/services/storage";
import { SyncStorageKey, type ViewModeValue } from "@/services/storage/types";
import { routeCommand, routeMessage } from "./router";

// chrome.sidePanel.open() はユーザージェスチャートークンが必要なため、
// await の前に呼び出せるよう viewMode をキャッシュしておく
let cachedViewMode: ViewModeValue = "popup";

export default defineBackground(() => {
  const updateViewMode = (viewMode: ViewModeValue) => {
    cachedViewMode = viewMode;
    chrome.sidePanel
      .setPanelBehavior({ openPanelOnActionClick: viewMode === "sidepanel" })
      .catch(console.error);
  };

  // サイドパネルの初期化
  storageService.getViewMode().then(updateViewMode);

  // viewMode変更時にキャッシュとサイドパネルの動作を更新
  storageService.subscribe(SyncStorageKey.ViewMode, (viewMode) => {
    updateViewMode(viewMode ?? "popup");
  });

  /**
   * @description コマンドのルーティング
   */
  chrome.commands.onCommand.addListener((command, tab) => {
    routeCommand(command, tab, cachedViewMode);
  });

  /**
   * @description メッセージのルーティング
   */
  chrome.runtime.onMessage.addListener((message, sender, response) =>
    routeMessage(message, sender, response),
  );
});
