import ArrowLongRightIcon from "@heroicons/react/16/solid/ArrowLongRightIcon";
import WindowIcon from "@heroicons/react/16/solid/WindowIcon";
import CommonItem from "@/components/common/result/CommonItem";
import SquareIcon from "@/components/common/icon/SquareIcon";
import { Tab } from "@/types/chrome";

export default function TabItem({
  key,
  className,
  item,
  onClick,
  isSelected,
}: {
  key: number;
  className?: string;
  item: Tab;
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
            {item.icon ? (
              <img src={item.icon} alt="favicon" className="size-5" />
            ) : (
              <WindowIcon className="text-gray-500 size-5" />
            )}
          </SquareIcon>
        }
        rightContent={
          <div className="flex items-center space-x-2">
            <span className="text-xs text-gray-300">Go to Tab</span>
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
