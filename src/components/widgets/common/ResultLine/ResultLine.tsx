import BookmarkItem from "@/components/widgets/common/ResultLine/parts/BookmarkItem";
import CalculationItem from "@/components/widgets/common/ResultLine/parts/CalculationItem";
import HistoryItem from "@/components/widgets/common/ResultLine/parts/HistoryItem";
import SuggestionItem from "@/components/widgets/common/ResultLine/parts/SuggestionItem";
import TabItem from "@/components/widgets/common/ResultLine/parts/TabItem";
import type { Bookmark } from "@/services/bookmark/types";
import type { History } from "@/services/history/types";
import type { Suggestion } from "@/services/suggestion/types";
import type { Tab } from "@/services/tab/types";

import { ActionType, type Calculation } from "@/types/action";

import { type Result, ResultType } from "@/types/result";

type LineProps = {
  key: React.Key;
  className?: string | undefined;
  item: Result;
  onClick?: (event: React.MouseEvent) => void;
  isSelected: boolean;
};

export default function ResultLine({
  key,
  className,
  item,
  onClick,
  isSelected,
}: LineProps) {
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
        item={item as Calculation}
        onClick={onClick}
        isSelected={isSelected}
      />
    );
  }

  return null;
}
