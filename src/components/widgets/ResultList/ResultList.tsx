import type { Kind, Result } from "@/services/result";

import BookmarkItem from "../BookmarkItem/BookmarkItem";
import HistoryItem from "../HistoryItem/HistoryItem";
import SuggestionItem from "../SuggestionItem/SuggestionItem";
import TabItem from "../TabItem/TabItem";

export interface ResultListProps {
  items: Result<Kind>[];
  ref: React.Ref<HTMLUListElement>;
  selectedIndex?: number;
  onClick?: (item: Result<Kind>) => void;
}

type ItemProps<T extends Kind> = {
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
  Tab: (props) => <TabItem {...(props as ItemProps<"Tab">)} />,
  Bookmark: (props) => <BookmarkItem {...(props as ItemProps<"Bookmark">)} />,
  History: (props) => <HistoryItem {...(props as ItemProps<"History">)} />,
  Suggestion: (props) => (
    <SuggestionItem {...(props as ItemProps<"Suggestion">)} />
  ),
};

const ItemComponent = ({
  item,
  index,
  onClick,
  selected,
}: {
  item: Result<Kind>;
  index: number;
  onClick: () => void;
  selected: boolean;
}) => {
  const Component = ItemMap[item.type];
  return (
    <Component
      item={item}
      index={index}
      onClick={onClick}
      selected={selected}
    />
  );
};

const ResultList: React.FC<ResultListProps> = ({
  items,
  onClick,
  ref,
  selectedIndex,
}) => {
  const hasItems = items.length > 0;

  if (!hasItems) {
    return null;
  }

  return (
    <div className="pt-3 pb-2 dark:bg-gray-800">
      <ul className="result-list" ref={ref}>
        {items.map((item, index) => (
          <ItemComponent
            key={`result-item-${index.toString()}`}
            item={item}
            index={index}
            onClick={() => onClick?.(item)}
            selected={index === selectedIndex}
          />
        ))}
      </ul>
    </div>
  );
};

export default ResultList;
