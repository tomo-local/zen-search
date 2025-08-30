import EqualsIcon from "@heroicons/react/16/solid/EqualsIcon";
import PlusIcon from "@heroicons/react/16/solid/PlusIcon";
import clsx from "clsx";
import SquareIcon from "@/components/modules/SquareIcon/SquareIcon";
import CommonItem, {
  commonClassName as common,
} from "@/components/widgets/ResultLine/parts/CommonItem";
import type { ActionCalculation } from "@/services/action/types";

type TabItemProps = {
  key: React.Key;
  className?: string | undefined;
  item: ActionCalculation;
  onClick?: (event: React.MouseEvent) => void;
  isSelected: boolean;
};

export default function CalculationItem({
  key,
  className,
  item,
  onClick,
  isSelected,
}: TabItemProps) {
  return (
    <CommonItem
      key={key}
      className={clsx(
        common.bg,
        common.border,
        common.hover,
        isSelected && common.selected,
        className,
      )}
      onClick={onClick}
      LeftContent={
        <SquareIcon className={clsx(isSelected && common.icon.bg)}>
          <EqualsIcon
            className={clsx(
              isSelected ? common.icon.selected : common.icon.text,
              common.icon.size,
            )}
          />
        </SquareIcon>
      }
      RightContent={
        <div className="flex items-center space-x-2">
          <span className={common.text}>Go to Calculation</span>
          <SquareIcon className={clsx(isSelected && common.icon.bg)}>
            <PlusIcon
              className={clsx(
                common.icon.size,
                isSelected ? common.icon.selected : common.icon.text,
              )}
            />
          </SquareIcon>
        </div>
      }
      isSelected={isSelected}
    >
      <div className="relative flex-col items-center justify-center inline-block max-w-fit">
        <div className="text-xs truncate max-w-[224px] md:max-w-md whitespace-nowrap">
          {item.data.expression}
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {` = ${item.data.result}`}
          </p>
        </div>
      </div>
    </CommonItem>
  );
}
