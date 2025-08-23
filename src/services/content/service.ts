/**
 * Open Service - マイクロサービス形式のコンテンツ開閉管理サービス
 * 責任: 各種コンテンツ（ポップアップ、タブ、ランタイム）の開閉を担当
 */

// 型定義
export interface ContentService {
  open: () => Promise<void>;
  close: () => Promise<void>;
  openTabs: (action: Promise<void>) => Promise<void>;
}

// サービス実装
const open = async (): Promise<void> => {
  try {
    await chrome.action.openPopup();
  } catch (error) {
    console.error(`Failed to open Content:`, error);
    throw new Error("コンテンツの表示に失敗しました");
  }
};

const openTabs = async (action: Promise<void>): Promise<void> => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const tabId = tabs[0].id;
    if (tabId) {
      action;
    }
  });
};

// サービスオブジェクトのエクスポート
export const contentService: ContentService = {
  open,
  // MEMO: openを2回実行するとcloseするため、openをそのまま利用
  close: open,
  openTabs,
};

// デフォルトエクスポート
export default contentService;
