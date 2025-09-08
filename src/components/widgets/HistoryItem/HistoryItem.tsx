import PlusIcon from "@heroicons/react/16/solid/PlusIcon";
import clsx from "clsx";
import type React from "react";
import { useMemo } from "react";
import type { NewHistory as History } from "@/services/history";

import ButtonItem, {
  type ButtonItemProps,
  defaultClassName,
} from "../../modules/ButtonItem/ButtonItem";
import SquareIcon from "../../modules/SquareIcon/SquareIcon";

type HistoryData = Pick<History["data"], "id" | "title" | "url">;

export type HistoryItemProps = Pick<ButtonItemProps, "onClick" | "selected"> & {
  item: {
    data: HistoryData;
  };
};

const HistoryItem: React.FC<HistoryItemProps> = ({
  onClick,
  selected,
  item,
}) => {
  const LeftIcon = useMemo(
    () => (
      <SquareIcon>
        <img
          src={`https://www.google.com/s2/favicons?domain=${
            new URL(item.data.url || "https://example.com").hostname
          }`}
          alt="favicon"
          className={defaultClassName.icon.size}
        />
      </SquareIcon>
    ),
    [item.data.url],
  );

  const RightContent = useMemo(
    () => (
      <div className="flex items-center space-x-2">
        <span className={defaultClassName.text}>Go to Tab</span>
        <SquareIcon className={clsx(selected && defaultClassName.icon.bg)}>
          <PlusIcon
            className={clsx(
              defaultClassName.icon.size,
              selected && defaultClassName.icon.selected,
            )}
          />
        </SquareIcon>
      </div>
    ),
    [selected],
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
        id={item.data.id}
        className="relative flex flex-col items-center justify-center max-w-fit"
      >
        <div className="text-sm truncate max-w-[224px] md:max-w-md whitespace-nowrap">
          {item.data.title}
        </div>
      </div>
    </ButtonItem>
  );
};

export default HistoryItem;
