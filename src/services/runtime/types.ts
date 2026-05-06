/**
 * Runtime Service Types - runtime通信で使用する型定義
 */

// レスポンス型定義
export interface RuntimeResponse<T = unknown> {
  type: string;
  result: T;
}

/**
 * 値が RuntimeResponse 型の構造を持っているかを確認する型ガード関数。
 * chrome.runtime.sendMessage のレスポンスを安全にナローイングするために使用する。
 *
 * @param value 検証する値
 * @returns `{ type: string, result: T }` の構造を持つ場合は true
 */
export function isRuntimeResponse<T>(
  value: unknown,
): value is RuntimeResponse<T> {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    typeof (value as { type: unknown }).type === "string" &&
    "result" in value
  );
}

// リクエスト型定義（将来的な拡張用）
export interface QueryTabsRequest {
  query: string;
  count?: number;
}

export enum MessageType {
  CLOSE_POPUP = "CLOSE_POPUP",
  CLOSE_SIDEPANEL = "CLOSE_SIDEPANEL",
  OPEN_POPUP = "OPEN_POPUP",
  CREATE_TAB = "CREATE_TAB",
  UPDATE_TAB = "UPDATE_TAB",
  REMOVE_TAB = "REMOVE_TAB",
  QUERY_RESULT = "QUERY_RESULT",
  SWITCH_VIEW_MODE = "SWITCH_VIEW_MODE",
  INVALIDATE_CACHE = "INVALIDATE_CACHE",
  // Storage operations routed through background
  GET_THEME = "GET_THEME",
  SET_THEME = "SET_THEME",
  GET_VIEW_MODE = "GET_VIEW_MODE",
  SET_VIEW_MODE = "SET_VIEW_MODE",
  GET_SEARCH_ENGINES = "GET_SEARCH_ENGINES",
  SET_SEARCH_ENGINES = "SET_SEARCH_ENGINES",
  // Background → UI notification when storage changes
  STORAGE_CHANGED = "STORAGE_CHANGED",
}

export type InvalidateCacheKind = "Tab" | "Bookmark" | "History";

export interface SwitchViewModeRequest {
  type: MessageType.SWITCH_VIEW_MODE;
}

/** Background から UI へのストレージ変更通知メッセージ */
export interface StorageChangedMessage {
  type: MessageType.STORAGE_CHANGED;
  key: string;
  value: unknown;
}

/**
 * メッセージが STORAGE_CHANGED メッセージかどうかを確認する型ガード関数。
 * @param message - 検証するメッセージ
 * @returns STORAGE_CHANGED メッセージの場合は true
 */
export function isStorageChangedMessage(
  message: unknown,
): message is StorageChangedMessage {
  if (typeof message !== "object" || message === null) return false;
  const m = message as { type?: unknown; key?: unknown };
  return m.type === MessageType.STORAGE_CHANGED && typeof m.key === "string";
}
