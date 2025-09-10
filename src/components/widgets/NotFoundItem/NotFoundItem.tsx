import NoSymbolIcon from "@heroicons/react/16/solid/NoSymbolIcon";
import clsx from "clsx";
import ButtonItem, {
  type ButtonItemProps,
  defaultClassName,
} from "../../modules/ButtonItem/ButtonItem";
import SquareIcon from "../../modules/SquareIcon/SquareIcon";

export type NotFoundItemProps = Pick<
  ButtonItemProps,
  "onClick" | "selected" | "disabled"
>;

const NotFoundItem: React.FC<NotFoundItemProps> = ({
  selected,
  onClick,
  disabled = true,
}) => {
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
      <div className="w-full text-base text-center">Not found...</div>
    </ButtonItem>
  );
};

export default NotFoundItem;
