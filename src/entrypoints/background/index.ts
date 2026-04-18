import { storageService } from "@/services/storage";
import { SyncStorageKey } from "@/services/storage/types";
import { routeCommand, routeMessage } from "./router";

export default defineBackground(() => {
  // サイドパネルの初期化
  storageService.getViewMode().then((viewMode) => {
    chrome.sidePanel
      .setPanelBehavior({ openPanelOnActionClick: viewMode === "sidepanel" })
      .catch(console.error);
  });

  // viewMode変更時にサイドパネルの動作を更新
  storageService.subscribe(SyncStorageKey.ViewMode, (viewMode) => {
    chrome.sidePanel
      .setPanelBehavior({ openPanelOnActionClick: viewMode === "sidepanel" })
      .catch(console.error);
  });

  /**
   * @description コマンドのルーティング
   */
  chrome.commands.onCommand.addListener((command, tab) => {
    routeCommand(command, tab);
  });

  /**
   * @description メッセージのルーティング
   */
  chrome.runtime.onMessage.addListener((message, sender, response) =>
    routeMessage(message, sender, response),
  );
});
