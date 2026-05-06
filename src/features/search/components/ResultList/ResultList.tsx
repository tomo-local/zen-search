import React from "react";
import type { Kind, Result } from "@/services/result";
import NotFoundItem from "../NotFoundItem/NotFoundItem";
import ItemComponent from "./part/ResultItem/ResultItem";

/** Props for the ResultList component. */
export interface ResultListProps {
  items: Result<Kind>[];
  selectedIndex?: number;
  onClick?: (item: Result<Kind>) => void;
  className?: string;
  listClassName?: string;
}

/** 検索結果のリストを描画するコンポーネント。`forwardRef` で `ul` 要素を公開する。 */
const ResultList = React.forwardRef<HTMLUListElement, ResultListProps>(
  (
    { items, onClick, selectedIndex, className, listClassName = "max-h-56" },
    ref,
  ) => {
    const hasItems = items.length > 0;

    return (
      <div className={`pt-3 pb-2 dark:bg-gray-800 ${className ?? ""}`}>
        <ul
          className={`pr-3 space-y-1 overflow-x-hidden overflow-y-auto snap-y snap-mandatory ${listClassName}`}
          ref={ref}
        >
          {hasItems ? (
            items.map((item, index) => (
              <ItemComponent
                key={item.id}
                item={item}
                index={index}
                onClick={() => onClick?.(item)}
                selected={index === selectedIndex}
              />
            ))
          ) : (
            <NotFoundItem selected={false} />
          )}
        </ul>
      </div>
    );
  },
);

ResultList.displayName = "ResultList";

export default ResultList;
