import type { Kind, Result } from "@/services/result";

import ItemComponent from "./part/ResultItem/ResultItem";

export interface ResultListProps {
  items: Result<Kind>[];
  ref: React.Ref<HTMLUListElement>;
  selectedIndex?: number;
  onClick?: (item: Result<Kind>) => void;
}

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
      <ul className="space-y-1 overflow-x-hidden overflow-y-auto hidden-scrollbar max-h-56" ref={ref}>
        {items.map((item, index) => (
          <ItemComponent
            key={`result-item-${item.type}-${index.toString()}`}
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
