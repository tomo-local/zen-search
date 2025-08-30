import { type ActionCalculation, ActionType } from "@/services/action/types";
import type { Bookmark } from "@/services/bookmark/types";
import type { History } from "@/services/history/types";
import type { Suggestion } from "@/services/suggestion/types";
import type { Tab } from "@/services/tab/types";
import { type Result, ResultType } from "@/types/result";

import BookmarkItem from "./parts/BookmarkItem";
import CalculationItem from "./parts/CalculationItem";
import HistoryItem from "./parts/HistoryItem";
import SuggestionItem from "./parts/SuggestionItem";
import TabItem from "./parts/TabItem";

export interface ResultLineProps {
  key: React.Key;
  className?: string | undefined;
  item: Result;
  onClick?: (event: React.MouseEvent) => void;
  isSelected: boolean;
}

export default function ResultLine({
  key,
  className,
  item,
  onClick,
  isSelected,
}: ResultLineProps) {
  if (item.type === ResultType.Tab) {
    return (
      <TabItem
        key={key}
        className={className}
        item={item as Tab}
        onClick={onClick}
        isSelected={isSelected}
      />
    );
  }

  if (item.type === ResultType.Google) {
    return (
      <SuggestionItem
        key={key}
        className={className}
        item={item as Suggestion}
        onClick={onClick}
        isSelected={isSelected}
      />
    );
  }

  if (item.type === ResultType.History) {
    return (
      <HistoryItem
        key={key}
        className={className}
        item={item as History}
        onClick={onClick}
        isSelected={isSelected}
      />
    );
  }

  if (item.type === ResultType.Bookmark) {
    return (
      <BookmarkItem
        key={key}
        className={className}
        item={item as Bookmark}
        onClick={onClick}
        isSelected={isSelected}
      />
    );
  }

  if (item.type === ActionType.Calculation) {
    return (
      <CalculationItem
        key={key}
        className={className}
        item={item as ActionCalculation}
        onClick={onClick}
        isSelected={isSelected}
      />
    );
  }

  return null;
}
