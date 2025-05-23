import TabItem from "@/components/widgets/common/ResultLine/parts/TabItem";
import SuggestionItem from "@/components/widgets/common/ResultLine/parts/SuggestionItem";
import HistoryItem from "@/components/widgets/common/ResultLine/parts/HistoryItem";
import BookmarkItem from "@/components/widgets/common/ResultLine/parts/BookmarkItem";

import { Tab, History, Bookmark } from "@/types/chrome";
import { Suggestion } from "@/types/google";
import { ResultType, Result } from "@/types/result";
import { ActionType, Calculation } from "@/types/action";
import CalculationItem from "./parts/CalculationItem";

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
