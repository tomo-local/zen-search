import { ResultType } from "@/types/result";

export enum MessageType {
  CLOSE_POPUP = "CLOSE_POPUP",
  OPEN_POPUP = "OPEN_POPUP",
  QUERY_TAB = "QUERY_TAB",
  CREATE_TAB = "CREATE_TAB",
  UPDATE_TAB = "UPDATE_TAB",
  REMOVE_TAB = "REMOVE_TAB",
  QUERY_HISTORY = "QUERY_HISTORY",
}

export enum ActionType {
  runtime = "runtime",
  tabs = "tabs",
  popup = "popup",
}

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
  match: number;
}

export type QueryOption = Pick<chrome.tabs.QueryInfo, "currentWindow"> & {
  count?: number;
};

export interface QueryMessage {
  type: MessageType.QUERY_TAB;
  query: string;
  count?: number;
}

export interface CreateMessage {
  type: MessageType.CREATE_TAB;
  url: string;
}

export interface UpdateMessage {
  type: MessageType.UPDATE_TAB;
  tabId: number;
  windowId?: number;
}

export interface RemoveMessage {
  type: MessageType.REMOVE_TAB;
  tabId: number;
}

export interface History {
  type: ResultType.History;
  id: number;
  title: string;
  url: string;
  match: number;
}

export interface QueryHistoryMessage {
  type: MessageType.QUERY_HISTORY;
  query: string;
  startTime?: number;
  endTime?: number;
  count?: number;
}
