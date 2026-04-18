/**
 * Runtime Service Types - runtime通信で使用する型定義
 */

// レスポンス型定義
export interface RuntimeResponse<T = unknown> {
  type: string;
  result: T;
}

// リクエスト型定義（将来的な拡張用）
export interface QueryTabsRequest {
  query: string;
  count?: number;
}

export enum MessageType {
  CLOSE_POPUP = "CLOSE_POPUP",
  OPEN_POPUP = "OPEN_POPUP",
  CREATE_TAB = "CREATE_TAB",
  UPDATE_TAB = "UPDATE_TAB",
  REMOVE_TAB = "REMOVE_TAB",
  QUERY_RESULT = "QUERY_RESULT",
  SWITCH_VIEW_MODE = "SWITCH_VIEW_MODE",
}

export interface SwitchViewModeRequest {
  type: MessageType.SWITCH_VIEW_MODE;
  viewMode: "popup" | "sidepanel";
}
