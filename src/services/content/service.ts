/**
 * Open Service - マイクロサービス形式のコンテンツ開閉管理サービス
 * 責任: 各種コンテンツ（ポップアップ、タブ、ランタイム）の開閉を担当
 */

import type { ContentService } from "./interface";
import { logger } from "./internal";
import type * as Type from "./types";

// サービス実装
const open = async ({
  windowId,
}: Type.OpenRequest): Promise<Type.OpenResponse> => {
  try {
    await chrome.action.openPopup({ windowId });
    return { success: true };
  } catch (error) {
    logger.error("Failed to open content:", error, { payload: { windowId } });
    return { success: false };
  }
};

const close = (): void => {
  window?.close();
};

const openTabs = async (
  action: () => Promise<Type.OpenResponse>,
): Promise<void> => {
  const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tabs[0]?.id) return;
  await action();
};

// サービスオブジェクトのエクスポート
export const contentService: ContentService = {
  open,
  close,
  openTabs,
};

// デフォルトエクスポート
export default contentService;
