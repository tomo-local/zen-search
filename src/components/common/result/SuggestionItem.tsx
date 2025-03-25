import ArrowLongRightIcon from "@heroicons/react/16/solid/ArrowLongRightIcon";
import MagnifyingGlassIcon from "@heroicons/react/16/solid/MagnifyingGlassIcon";
import CommonItem from "@/components/common/result/CommonItem";
import SquareIcon from "@/components/common/icon/SquareIcon";
import { Suggestion } from "@/types/google";

export default function SuggestionItem({
  key,
  className,
  item,
  onClick,
  isSelected,
}: {
  key: number;
  className?: string;
  item: Suggestion;
  onClick?: (event: React.MouseEvent) => void;
  isSelected: boolean;
}) {
  return (
    <li key={key}>
      <CommonItem
        className={`text-gray-200 bg-gray-800 border-sky-500 ${
          isSelected && "bg-sky-500"
        } ${className}`}
        onClick={onClick}
        leftContent={
          <SquareIcon className={isSelected ? "bg-gray-300" : ""}>
            <MagnifyingGlassIcon className="text-gray-500 size-5" />
          </SquareIcon>
        }
        rightContent={
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-300">Go to Search</span>
            <SquareIcon className={isSelected ? "bg-gray-300" : ""}>
              <ArrowLongRightIcon
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
    </li>
  );
}
