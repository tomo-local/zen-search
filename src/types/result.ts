import { Tab, History, Bookmark } from "@/types/chrome";
import { Suggestion } from "@/types/google";

export enum ResultType {
  All = "All",
  Tab = "Tab",
  Bookmark = "Bookmark",
  History = "History",
  Google = "Google",
}

export type Result = Tab | Suggestion | History | Bookmark;
