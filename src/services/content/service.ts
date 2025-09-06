/**
 * Open Service - マイクロサービス形式のコンテンツ開閉管理サービス
 * 責任: 各種コンテンツ（ポップアップ、タブ、ランタイム）の開閉を担当
 */

import type * as Type from "./types";

export interface ContentService {
  open: (request: Type.OpenRequest) => Promise<Type.OpenResponse>;
  close: () => void;
  openTabs: (action: Promise<Type.OpenResponse>) => Promise<void>;
}

// サービス実装
const open = async ({
  windowId,
}: Type.OpenRequest): Promise<Type.OpenResponse> => {
  try {
    await chrome.action.openPopup({ windowId });
    return { success: true };
  } catch (error) {
    console.error(`Failed to open Content:`, error);
    return { success: false };
  }
};

const close = (): void => {
  window?.close();
};

const openTabs = async (action: Promise<Type.OpenResponse>): Promise<void> =>
  chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
    const tabId = tabs[0].id;
    if (tabId) {
      await action;
    }
  });

// サービスオブジェクトのエクスポート
export const contentService: ContentService = {
  open,
  close,
  openTabs,
};

// デフォルトエクスポート
export default contentService;
