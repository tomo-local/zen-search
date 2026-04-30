import PlusIcon from "@heroicons/react/16/solid/PlusIcon";
import clsx from "clsx";
import { useMemo } from "react";
import type { Suggestion } from "@/services/suggestion/types";
import ButtonItem, {
  type ButtonItemProps,
  defaultClassName,
} from "@/shared/components/ButtonItem/ButtonItem";
import SquareIcon from "@/shared/components/SquareIcon/SquareIcon";
import { useTranslation } from "@/shared/hooks/useTranslation";

type SuggestionData = Pick<Suggestion["data"], "title" | "url" | "type">;

export type SuggestionItemProps = Pick<
  ButtonItemProps,
  "onClick" | "selected"
> & {
  item: {
    data: SuggestionData;
  };
};

const SuggestionItem: React.FC<SuggestionItemProps> = ({
  item,
  onClick,
  selected,
}) => {
  const { t } = useTranslation();
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
      <div className="flex items-center gap-1.5">
        <span className="text-xs opacity-50 whitespace-nowrap">
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
      <div className="min-w-0 w-full">
        <div className="text-sm truncate whitespace-nowrap">
          {item.data.title}
        </div>
      </div>
    </ButtonItem>
  );
};

export default SuggestionItem;
