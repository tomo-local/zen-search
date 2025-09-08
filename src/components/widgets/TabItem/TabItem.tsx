import ArrowLongRightIcon from "@heroicons/react/16/solid/ArrowLongRightIcon";
import WindowIcon from "@heroicons/react/16/solid/WindowIcon";
import clsx from "clsx";
import type { NewTab as Tab } from "@/services/tab/types";

import ButtonItem, {
  type ButtonItemProps,
  defaultClassName,
} from "../../modules/ButtonItem/ButtonItem";
import SquareIcon from "../../modules/SquareIcon/SquareIcon";

type TabData = Pick<Tab["data"], "id" | "title" | "url" | "favIconUrl">;

export type TabItemProps = Pick<ButtonItemProps, "onClick" | "selected"> & {
  item: {
    data: TabData;
  };
};

const TabItem: React.FC<TabItemProps> = ({ item, onClick, selected }) => {
  const LeftIcon = (
    <SquareIcon>
      <WindowIcon
        className={clsx(defaultClassName.icon.size, defaultClassName.icon.text)}
      />
    </SquareIcon>
  );

  const RightContent = (
    <div className="flex items-center space-x-2">
      <span className={defaultClassName.text}>Go to Tab</span>
      <SquareIcon className={clsx(selected && defaultClassName.icon.bg)}>
        <ArrowLongRightIcon
          className={clsx(
            defaultClassName.icon.size,
            selected && defaultClassName.icon.selected
          )}
        />
      </SquareIcon>
    </div>
  );

  return (
    <ButtonItem
      className={clsx(
        defaultClassName.bg,
        defaultClassName.border,
        defaultClassName.hover,
      )}
      onClick={onClick}
      selected={selected}
      LeftContent={LeftIcon}
      RightContent={RightContent}
    >
      <div
        id={item.data.id?.toString()}
        className="relative flex-col items-center justify-center max-w-fit justify-items-center"
      >
        <div className="text-sm truncate max-w-[224px] md:max-w-md whitespace-nowrap">
          {item.data.title}
        </div>
      </div>
    </ButtonItem>
  );
};

export default TabItem;
