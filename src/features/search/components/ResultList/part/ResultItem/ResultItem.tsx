import CalculationItem from "@/features/action/components/CalculationItem/CalculationItem";
import BookmarkItem from "@/features/bookmark/components/BookmarkItem/BookmarkItem";
import HistoryItem from "@/features/history/components/HistoryItem/HistoryItem";
import SuggestionItem from "@/features/suggestion/components/SuggestionItem/SuggestionItem";
import TabItem from "@/features/tab/components/TabItem/TabItem";
import type { Kind, Result } from "@/services/result";

export type ResultItemProps<T extends Kind> = {
  item: Result<T>;
  index: number;
  onClick: () => void;
  selected: boolean;
};

const ItemMap: Record<
  Kind,
  React.FC<{
    item: Result<Kind>;
    index: number;
    onClick: () => void;
    selected: boolean;
  }>
> = {
  Tab: (props) => <TabItem {...(props as ResultItemProps<"Tab">)} />,
  Bookmark: (props) => (
    <BookmarkItem {...(props as ResultItemProps<"Bookmark">)} />
  ),
  History: (props) => (
    <HistoryItem {...(props as ResultItemProps<"History">)} />
  ),
  Suggestion: (props) => (
    <SuggestionItem {...(props as ResultItemProps<"Suggestion">)} />
  ),
  "Action.Calculation": (props) => (
    <CalculationItem {...(props as ResultItemProps<"Action.Calculation">)} />
  ),
};

const ResultItem: React.FC<ResultItemProps<Kind>> = (props) => {
  const Component = ItemMap[props.item.type];
  return (
    <Component
      item={props.item}
      index={props.index}
      onClick={props.onClick}
      selected={props.selected}
    />
  );
};

export default ResultItem;
