import { storageService } from "@/services/storage";
import { SyncStorageKey, type ViewModeValue } from "@/services/storage/types";
import { routeCommand, routeMessage } from "./router";

// chrome.sidePanel.open() はユーザージェスチャートークンが必要なため、
// await の前に呼び出せるよう viewMode をキャッシュしておく
let cachedViewMode: ViewModeValue = "popup";

// サイドパネルの開閉状態をポート接続で追跡する
// ポートが存在する = サイドパネルが開いている
let sidePanelPort: chrome.runtime.Port | null = null;

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

  // ポート接続の処理:
  // - "sidepanel": サイドパネルの開閉状態を追跡する
  // - "keepalive": ポップアップからの SW 生存維持用（接続を受け入れるだけでよい）
  // いずれのポートも接続が続く限り MV3 Service Worker を生存させる
  chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "sidepanel") {
      sidePanelPort = port;
      port.onDisconnect.addListener(() => {
        sidePanelPort = null;
      });
    }
  });

  /**
   * @description コマンドのルーティング
   */
  chrome.commands.onCommand.addListener((command, tab) => {
    routeCommand(command, tab, cachedViewMode, sidePanelPort);
  });

  /**
   * @description メッセージのルーティング
   */
  chrome.runtime.onMessage.addListener((message, sender, response) =>
    routeMessage(message, sender, response),
  );
});
