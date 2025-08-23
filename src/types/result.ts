import { Tab } from "@/services/tab";
import { History } from "@/services/history";
import type { Bookmark } from "@/services/bookmark";
import { Suggestion } from "@/services/suggestion";
import { Action } from "@/types/action";

export enum ResultType {
  All = "All",
  Tab = "Tab",
  Bookmark = "Bookmark",
  History = "History",
  Google = "Google",
}

export enum MessageType {
  CLOSE_POPUP = "CLOSE_POPUP",
  OPEN_POPUP = "OPEN_POPUP",
  QUERY_TAB = "QUERY_TAB",
  CREATE_TAB = "CREATE_TAB",
  UPDATE_TAB = "UPDATE_TAB",
  REMOVE_TAB = "REMOVE_TAB",
  QUERY_HISTORY = "QUERY_HISTORY",
  QUERY_SUGGESTION = "QUERY_SUGGESTION",
  QUERY_BOOKMARK = "QUERY_BOOKMARK",
}

export type Result = Tab | Suggestion | History | Bookmark | Action;
