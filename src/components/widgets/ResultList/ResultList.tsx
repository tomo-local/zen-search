import Spinner from "@/components/modules/Spinner/Spinner";
import type { Kind, Result } from "@/services/result";
import NotFoundItem from "../NotFoundItem/NotFoundItem";
import ItemComponent from "./part/ResultItem/ResultItem";

export interface ResultListProps {
  items: Result<Kind>[];
  loading: boolean;
  ref: React.Ref<HTMLUListElement>;
  selectedIndex?: number;
  onClick?: (item: Result<Kind>) => void;
}

const ResultList: React.FC<ResultListProps> = ({
  items,
  loading,
  onClick,
  ref,
  selectedIndex,
}) => {
  const displayComponent = useMemo(() => {
    if (loading) {
      return (
        <div className="flex items-center justify-center max-w-full py-4 max-h-48 min-h-48">
          <Spinner active={true} size="md" />
        </div>
      );
    }

    if (items.length === 0) {
      return <NotFoundItem selected={false} />;
    }

    return items.map((item, index) => (
      <ItemComponent
        key={`result-item-${item.type}-${index.toString()}`}
        item={item}
        index={index}
        onClick={() => onClick?.(item)}
        selected={index === selectedIndex}
      />
    ));
  }, [loading, items]);

  return (
    <div className="pt-3 pb-2 dark:bg-gray-800">
      <ul
        className="pr-3 space-y-1 overflow-x-hidden overflow-y-auto max-h-56 min-h-56 snap-y snap-mandatory"
        ref={ref}
      >
        {displayComponent}
      </ul>
    </div>
  );
};

export default ResultList;
