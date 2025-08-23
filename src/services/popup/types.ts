import { MessageType } from "@/types/result";

export enum ActionType {
  runtime = "runtime",
  tabs = "tabs",
  popup = "popup",
}

/**
 * ポップアップ開くリクエスト
 */
export interface OpenPopupRequest {
  type?: ActionType;
}

/**
 * ポップアップ閉じるリクエスト
 */
export interface ClosePopupRequest {
  type?: ActionType;
}

/**
 * ポップアップメッセージ
 */
export interface PopupMessage {
  type: MessageType.OPEN_POPUP | MessageType.CLOSE_POPUP;
}

/**
 * ポップアップ操作のリクエスト
 */
export interface PopupActionRequest {
  actionType: ActionType;
  messageType: MessageType.OPEN_POPUP | MessageType.CLOSE_POPUP;
}

/**
 * ポップアップサービスのレスポンス
 */
export interface PopupServiceResponse {
  type: MessageType;
  result: boolean;
  error?: string;
}
