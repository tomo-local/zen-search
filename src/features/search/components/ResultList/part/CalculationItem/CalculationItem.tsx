import CalculatorIcon from "@heroicons/react/16/solid/CalculatorIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import clsx from "clsx";
import type React from "react";
import { useMemo } from "react";
import type { Action } from "@/services/action/types";
import ButtonItem, {
  type ButtonItemProps,
  defaultClassName,
} from "@/shared/components/ButtonItem/ButtonItem";
import SquareIcon from "@/shared/components/SquareIcon/SquareIcon";
import { useTranslation } from "@/shared/hooks/useTranslation";

type CalculationData = Pick<
  Action<"Action.Calculation">["data"],
  "expression" | "result" | "url"
>;

export type CalculationItemProps = Pick<
  ButtonItemProps,
  "onClick" | "selected"
> & {
  item: {
    data: CalculationData;
  };
};

const CalculationItem: React.FC<CalculationItemProps> = ({
  item,
  selected,
  onClick,
}) => {
  const { t } = useTranslation();
  const LeftIcon = useMemo(
    () => (
      <SquareIcon>
        <CalculatorIcon
          className={clsx(
            defaultClassName.icon.size,
            defaultClassName.icon.text,
          )}
        />
      </SquareIcon>
    ),
    [],
  );

  const RightIcon = useMemo(
    () => (
      <div className="flex items-center gap-1.5">
        <span className="text-xs opacity-50 whitespace-nowrap">
          {t("actions.openResult")}
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
      onClick={onClick}
      selected={selected}
      LeftContent={LeftIcon}
      RightContent={RightIcon}
      className={clsx(
        defaultClassName.bg,
        defaultClassName.border,
        defaultClassName.hover,
      )}
    >
      <div className="flex w-full min-w-0 items-center gap-2 overflow-hidden">
        <div className="min-w-0 flex-1 truncate text-md">
          {item.data.expression}
        </div>
        <div className="text-md whitespace-nowrap">=</div>
        <div className="text-lg whitespace-nowrap">{item.data.result}</div>
      </div>
    </ButtonItem>
  );
};

export default CalculationItem;
