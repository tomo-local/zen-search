import ButtonItem from "@/components/modules/ButtonItem/ButtonItem";
import type { Kind, Result } from "@/services/result";
import BookmarkItem from "../../../BookmarkItem/BookmarkItem";
import HistoryItem from "../../../HistoryItem/HistoryItem";
import SuggestionItem from "../../../SuggestionItem/SuggestionItem";
import TabItem from "../../../TabItem/TabItem";

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
    <ButtonItem
      className="justify-between"
      onClick={props.onClick}
      selected={props.selected}
    >
      <span className="font-mono">{props.item.title}</span>
    </ButtonItem>
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
