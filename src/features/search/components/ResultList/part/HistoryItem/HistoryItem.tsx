import ClockIcon from "@heroicons/react/16/solid/ClockIcon";
import PlusIcon from "@heroicons/react/16/solid/PlusIcon";
import clsx from "clsx";
import type React from "react";
import { useMemo } from "react";

import type { History } from "@/services/history";
import ButtonItem, {
  type ButtonItemProps,
  defaultClassName,
} from "@/shared/components/ButtonItem/ButtonItem";
import SquareIcon from "@/shared/components/SquareIcon/SquareIcon";
import { useTranslation } from "@/shared/hooks/useTranslation";

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
      <div className="flex items-center gap-1.5">
        <span className={defaultClassName.actionLabel}>
          {t("actions.openTab")}
        </span>
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
      <div id={item.data.id} className="min-w-0 w-full">
        <div className="text-sm truncate whitespace-nowrap">
          {item.data.title}
        </div>
      </div>
    </ButtonItem>
  );
};

export default HistoryItem;
