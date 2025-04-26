import ArrowLongRightIcon from "@heroicons/react/16/solid/ArrowLongRightIcon";
import WindowIcon from "@heroicons/react/16/solid/WindowIcon";
import CommonItem, {
  commonClassName as common,
} from "@/components/common/result/item/CommonItem";
import SquareIcon from "@/components/modules/icon/SquareIcon";
import { Tab } from "@/types/chrome";
import clsx from "clsx";

type TabItemProps = {
  key: React.Key;
  className?: string | undefined;
  item: Tab;
  onClick?: (event: React.MouseEvent) => void;
  isSelected: boolean;
};

export default function TabItem({
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
        className
      )}
      onClick={onClick}
      leftContent={
        <SquareIcon className={clsx(isSelected && common.icon.bg)}>
          {item.icon ? (
            <img src={item.icon} alt="favicon" className={common.icon.size} />
          ) : (
            <WindowIcon
              className={clsx(
                isSelected ? common.icon.selected : common.icon.text,
                common.icon.size
              )}
            />
          )}
        </SquareIcon>
      }
      rightContent={
        <div className="flex items-center space-x-2">
          <span className={common.text}>Go to Tab</span>
          <SquareIcon className={clsx(isSelected && common.icon.bg)}>
            <ArrowLongRightIcon
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
