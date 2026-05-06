import NoSymbolIcon from "@heroicons/react/16/solid/NoSymbolIcon";
import clsx from "clsx";
import ButtonItem, {
  type ButtonItemProps,
  defaultClassName,
} from "@/shared/components/ButtonItem/ButtonItem";
import SquareIcon from "@/shared/components/SquareIcon/SquareIcon";
import { useTranslation } from "@/shared/hooks/useTranslation";

export type NotFoundItemProps = Pick<
  ButtonItemProps,
  "onClick" | "selected" | "disabled"
>;

const NotFoundItem: React.FC<NotFoundItemProps> = ({
  selected,
  onClick,
  disabled = true,
}) => {
  const { t } = useTranslation();
  return (
    <ButtonItem
      className={clsx(
        defaultClassName.bg,
        defaultClassName.border,
        defaultClassName.hover,
      )}
      LeftContent={
        <SquareIcon>
          <NoSymbolIcon
            className={clsx(
              defaultClassName.icon.size,
              defaultClassName.icon.text,
            )}
          />
        </SquareIcon>
      }
      onClick={onClick}
      selected={selected}
      disabled={disabled}
    >
      <div className="w-full text-base text-center">{t("ui.notFound")}</div>
    </ButtonItem>
  );
};

export default NotFoundItem;
