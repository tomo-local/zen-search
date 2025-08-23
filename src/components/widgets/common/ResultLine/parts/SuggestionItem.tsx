import PlusIcon from "@heroicons/react/16/solid/PlusIcon";
import MagnifyingGlassIcon from "@heroicons/react/16/solid/MagnifyingGlassIcon";
import CommonItem, {
  commonClassName as common,
} from "@/components/widgets/common/ResultLine/parts/CommonItem";
import SquareIcon from "@/components/modules/SquareIcon/SquareIcon";
import { Suggestion } from "@/types/google";
import clsx from "clsx";

type SuggestionItemProps = {
  key: React.Key;
  className?: string;
  item: Suggestion;
  onClick?: (event: React.MouseEvent) => void;
  isSelected: boolean;
};

export default function SuggestionItem({
  key,
  className,
  item,
  onClick,
  isSelected,
}: SuggestionItemProps) {
  return (
    <CommonItem
      key={key}
      className={clsx(
        common.bg,
        common.border,
        common.hover,
        isSelected && common.selected,
        className
      )}
      onClick={onClick}
      LeftContent={
        <SquareIcon className={clsx(isSelected && common.icon.bg)}>
          <MagnifyingGlassIcon
            className={clsx(
              isSelected ? common.icon.selected : common.icon.text,
              common.icon.size
            )}
          />
        </SquareIcon>
      }
      RightContent={
        <div className="flex items-center space-x-2">
          <span className={common.text}>Go to Search</span>
          <SquareIcon className={clsx(isSelected && common.icon.bg)}>
            <PlusIcon
              className={clsx(
                common.icon.size,
                isSelected ? common.icon.selected : common.icon.text
              )}
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
