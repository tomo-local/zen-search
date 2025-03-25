import TabItem from "@/components/common/result/TabItem";
import SuggestionItem from "@/components/common/result/SuggestionItem";
import HistoryItem from "@/components/common/result/HistoryItem";
import BookmarkItem from "@/components/common/result/BookmarkItem";

import { Tab, History, Bookmark } from "@/types/chrome";
import { Suggestion } from "@/types/google";
import { ResultType, Result } from "@/types/result";

type LineProps = {
  key: number;
  item: Result;
  onClick?: (event: React.MouseEvent) => void;
  isSelected: boolean;
  className?: string;
};

export default function ResultLine({
  key,
  item,
  onClick,
  isSelected,
  className,
}: LineProps) {
  if (item.type === ResultType.Tab) {
    return (
      <TabItem
        className={className}
        key={key}
        item={item as Tab}
        onClick={onClick}
        isSelected={isSelected}
      />
    );
  }

  if (item.type === ResultType.Google) {
    return (
      <SuggestionItem
        className={className}
        key={key}
        item={item as Suggestion}
        onClick={onClick}
        isSelected={isSelected}
      />
    );
  }

  if (item.type === ResultType.History) {
    return (
      <HistoryItem
        className={className}
        key={key}
        item={item as History}
        onClick={onClick}
        isSelected={isSelected}
      />
    );
  }

  if (item.type === ResultType.Bookmark) {
    return (
      <BookmarkItem
        className={className}
        key={key}
        item={item as Bookmark}
        onClick={onClick}
        isSelected={isSelected}
      />
    );
  }

  return null;
}
