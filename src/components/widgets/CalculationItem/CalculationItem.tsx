import CalculatorIcon from "@heroicons/react/16/solid/CalculatorIcon";
import PlusIcon from "@heroicons/react/24/outline/PlusIcon";
import clsx from "clsx";
import type React from "react";
import { useMemo } from "react";
import type { Action } from "@/services/action/types";

import ButtonItem, {
  type ButtonItemProps,
  defaultClassName,
} from "../../modules/ButtonItem/ButtonItem";
import SquareIcon from "../../modules/SquareIcon/SquareIcon";

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
  const LeftIcon = useMemo(
    () => (
      <SquareIcon>
        <CalculatorIcon
          className={clsx(defaultClassName.icon.size, defaultClassName.icon.text)}
        />
      </SquareIcon>
  ), []);

  const RightIcon = useMemo(
    () => (
      <div className="flex items-center space-x-2">
        <span className={defaultClassName.text}>Go to Result</span>
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
    [selected]
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
      <div className="flex flex-row items-center space-x-2">
        <div className="text-md">{item.data.expression}</div>
        <div className="text-md">=</div>
        <div className="text-lg">{item.data.result}</div>
      </div>
    </ButtonItem>
  );
};

export default CalculationItem;
