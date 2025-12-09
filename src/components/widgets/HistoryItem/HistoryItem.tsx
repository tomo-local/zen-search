import ClockIcon from "@heroicons/react/16/solid/ClockIcon";
import PlusIcon from "@heroicons/react/16/solid/PlusIcon";
import clsx from "clsx";
import type React from "react";
import { useMemo } from "react";

import { useTranslation } from "@/hooks/storage/useTranslation";
import type { History } from "@/services/history";

import ButtonItem, {
  type ButtonItemProps,
  defaultClassName,
} from "../../modules/ButtonItem/ButtonItem";
import SquareIcon from "../../modules/SquareIcon/SquareIcon";

type HistoryData = Pick<History["data"], "id" | "title" | "url" | "favIconUrl">;

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
  const { t } = useTranslation();

  const LeftIcon = useMemo(
    () => (
      <SquareIcon>
        {item.data.favIconUrl ? (
          <img
            src={item.data.favIconUrl}
            alt="Favicon"
            className={clsx(
              defaultClassName.icon.size,
              defaultClassName.icon.text,
            )}
          />
        ) : (
          <ClockIcon
            className={clsx(
              defaultClassName.icon.size,
              defaultClassName.icon.text,
            )}
          />
        )}
      </SquareIcon>
    ),
    [item.data.favIconUrl],
  );

  const RightContent = useMemo(
    () => (
      <div className="flex items-center space-x-2">
        <span className={defaultClassName.text}>{t("actions_openTab")}</span>
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
    [selected, t],
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
        <div className="text-sm truncate md:max-w-md whitespace-nowrap max-w-[450px]">
          {item.data.title}
        </div>
      </div>
    </ButtonItem>
  );
};

export default HistoryItem;
