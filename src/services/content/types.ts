/**
 * Open Service Types - コンテンツの開閉関連の型定義
 */

export enum ActionType {
  runtime = "runtime",
  tabs = "tabs",
  popup = "popup",
}

export interface OpenRequest {
  windowId?: number;
}

export interface OpenResponse {
  success: boolean;
}

export interface OpenTabsResponse {
  success: boolean;
}
