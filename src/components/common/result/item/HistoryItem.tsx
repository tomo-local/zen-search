import PlusIcon from "@heroicons/react/16/solid/PlusIcon";
import ClockIcon from "@heroicons/react/16/solid/ClockIcon";
import CommonItem from "@/components/common/result/item/CommonItem";
import SquareIcon from "@/components/common/icon/SquareIcon";
import { History } from "@/types/chrome";

const getFavicon = (url: string) => {
  const urlObj = new URL(url);
  return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}`;
};

type HistoryItemProps = {
  key: React.Key;
  className?: string | undefined;
  item: History;
  onClick?: (event: React.MouseEvent) => void;
  isSelected: boolean;
};

export default function HistoryItem({
  key,
  className,
  item,
  onClick,
  isSelected,
}: HistoryItemProps) {
  return (
    <CommonItem
      key={key}
      className={`text-gray-200 bg-gray-800 border-sky-500 ${
        isSelected && "bg-sky-500"
      } ${className}`}
      onClick={onClick}
      leftContent={
        <SquareIcon className={isSelected ? "bg-gray-300" : ""}>
          <img src={getFavicon(item.url)} alt="favicon" className="size-5" />
        </SquareIcon>
      }
      rightContent={
        <div className="flex items-center space-x-2">
          <ClockIcon className="text-gray-300 size-5" />
          <span className="text-xs text-gray-300">Go to Page</span>
          <SquareIcon className={isSelected ? "bg-gray-300" : ""}>
            <PlusIcon
              className={`size-5 ${
                isSelected ? "text-gray-500" : "text-gray-300"
              }`}
            />
          </SquareIcon>
        </div>
      }
      isSelected={isSelected}
    >
      <div className="relative flex-col items-center justify-center inline-block max-w-fit">
        <div className="text-sm truncate max-w-[224px] md:max-w-md whitespace-nowrap">
          {item.title}
        </div>
      </div>
    </CommonItem>
  );
}
