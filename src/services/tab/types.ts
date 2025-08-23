import { MessageType, ResultType } from "@/types/result";

/**
 * タブクエリのリクエスト
 */
export interface TabQueryRequest {
  query?: string;
  count?: number;
  currentWindow?: boolean;
}

/**
 * タブクエリのオプション
 */
export interface TabQueryOption {
  currentWindow?: boolean;
  count?: number;
}

/**
 * タブ
 */
export interface Tab {
  type: ResultType.Tab;
  id: number;
  title: string;
  url: string;
  icon: string;
  active: boolean;
  lastAccessed: number;
  windowId: number;
  currentWindow: boolean;
}

/**
 * タブ作成のリクエスト
 */
export interface CreateTabRequest {
  url: string;
}

/**
 * タブ更新のリクエスト
 */
export interface UpdateTabRequest {
  tabId: number;
  windowId?: number;
}

/**
 * タブ削除のリクエスト
 */
export interface RemoveTabRequest {
  tabId: number;
}

/**
 * タブクエリのメッセージ
 */
export interface QueryTabMessage {
  query: string;
  count?: number;
}

/**
 * タブ作成のメッセージ
 */
export interface CreateTabMessage {
  url: string;
}

/**
 * タブ更新のメッセージ
 */
export interface UpdateTabMessage {
  type: MessageType.UPDATE_TAB;
  tabId: number;
  windowId?: number;
}

/**
 * タブ削除のメッセージ
 */
export interface RemoveTabMessage {
  type: MessageType.REMOVE_TAB;
  tabId: number;
}
