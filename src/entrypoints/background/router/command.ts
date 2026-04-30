import { contentService } from "@/services/content";
import { MessageType } from "@/services/runtime/types";
import type { ViewModeValue } from "@/services/storage/types";

/**
 * コマンドに基づいて適切なアクション（ポップアップまたはサイドパネル）を呼び出します。
 *
 * @param command コマンド名
 * @param tab 実行時のタブ情報（コンテキストによっては undefined になる場合あり）
 * @param viewMode 現在の表示モード
 * @param sidePanelPort サイドパネルとのポート接続（開いている場合のみ存在）
 */
export const routeCommand = (
  command: string,
  tab: chrome.tabs.Tab | undefined,
  viewMode: ViewModeValue,
  sidePanelPort: chrome.runtime.Port | null,
) => {
  switch (command) {
    case MessageType.OPEN_POPUP: {
      if (viewMode === "sidepanel") {
        if (sidePanelPort !== null) {
          // サイドパネルが開いている → 閉じる
          sidePanelPort.postMessage({ type: MessageType.CLOSE_SIDEPANEL });
        } else if (tab?.id !== undefined) {
          // サイドパネルが閉じている → 開く
          // chrome.sidePanel.open() はユーザージェスチャートークンが必要なため、
          // await より前に同期的に呼び出す
          chrome.sidePanel.open({ tabId: tab.id }).catch(console.error);
        }
      } else {
        contentService.open({}).then((res) => {
          if (!res.success) {
            chrome.runtime.sendMessage({ type: "CLOSE_POPUP" });
          }
        });
      }
      return true;
    }
    default:
      return false;
  }
};
