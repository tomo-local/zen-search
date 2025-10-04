/**
 * useSearch関連のストレージ操作
 */

import { QUERY_HISTORY_KEY } from "./constants";

/**
 * クエリ履歴を読み込む
 * @returns クエリ履歴の配列
 */
export async function loadQueryHistory(): Promise<string[]> {
  try {
    const result = await browser.storage.local.get(QUERY_HISTORY_KEY);
    const stored = result[QUERY_HISTORY_KEY];
    if (stored && Array.isArray(stored)) {
      return stored;
    }
    return [];
  } catch (error) {
    console.error("Failed to load query history:", error);
    return [];
  }
}

/**
 * クエリ履歴を保存する
 * @param history - 保存する履歴の配列
 */
export async function saveQueryHistory(history: string[]): Promise<void> {
  try {
    await browser.storage.local.set({ [QUERY_HISTORY_KEY]: history });
  } catch (error) {
    console.error("Failed to save query history:", error);
  }
}

/**
 * クエリ履歴をクリアする
 */
export async function clearQueryHistory(): Promise<void> {
  try {
    await browser.storage.local.remove(QUERY_HISTORY_KEY);
  } catch (error) {
    console.error("Failed to clear query history:", error);
  }
}
