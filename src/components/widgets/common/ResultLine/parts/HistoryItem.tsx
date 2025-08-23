import ClockIcon from "@heroicons/react/16/solid/ClockIcon";
import PlusIcon from "@heroicons/react/16/solid/PlusIcon";
import clsx from "clsx";
import SquareIcon from "@/components/modules/SquareIcon/SquareIcon";
import CommonItem, {
  commonClassName as common,
} from "@/components/widgets/common/ResultLine/parts/CommonItem";
import type { History } from "@/types/chrome";

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
          <img
            src={getFavicon(item.url)}
            alt="favicon"
            className={common.icon.size}
          />
        </SquareIcon>
      }
      RightContent={
        <div className="flex items-center space-x-2">
          <ClockIcon className={clsx(common.icon.text, common.icon.size)} />
          <span className={common.text}>Go to Page</span>
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
        <div className="text-sm truncate max-w-[224px] md:max-w-md whitespace-nowrap">
          {item.title}
        </div>
      </div>
    </CommonItem>
  );
}
