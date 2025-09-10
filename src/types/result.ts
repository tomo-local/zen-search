import type { ActionCalculation } from "@/services/action/types";
import type { Bookmark } from "@/services/bookmark/types";
import type { History } from "@/services/history/types";
import type { Suggestion } from "@/services/suggestion/types";
import type { Tab } from "@/services/tab/types";

export enum ResultType {
  All = "All",
  Tab = "Tab",
  Bookmark = "Bookmark",
  History = "History",
  Google = "Google",
}

export type Result = Tab | Suggestion | History | Bookmark | ActionCalculation;
