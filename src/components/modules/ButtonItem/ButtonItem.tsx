import clsx from "clsx";

export interface ButtonItemProps {
  className?: string | undefined;
  disabled?: boolean;
  onClick?: (event: React.MouseEvent) => void;
  children: React.ReactNode;
  LeftContent?: React.ReactNode;
  RightContent?: React.ReactNode;
  selected?: boolean;
}

export const defaultClassName = {
  base: "flex items-center justify-between w-full px-4 py-2 text-left rounded-lg",
  bg: "dark:bg-gray-800 bg-gray-50",
  border: "border-sky-500",
  selected: "dark:bg-sky-600 bg-sky-400 dark:text-gray-300 text-gray-100",
  hover:
    "hover:dark:bg-sky-700 hover:bg-sky-300 hover:opacity-80 hover:cursor-pointer",
  icon: {
    bg: "dark:bg-sky-200 bg-sky-50",
    text: "dark:text-gray-300",
    selected: "dark:text-sky-500 text-sky-400",
    size: "size-5",
  },
  text: "dark:text-gray-300 text-xs font-medium",
};

const ButtonItem: React.FC<ButtonItemProps> = (props) => {
  return (
    <li className="list-none snap-start">
      <button
        type="button"
        disabled={props.disabled}
        className={clsx(
          defaultClassName.base,
          defaultClassName.text,
          props.selected && defaultClassName.selected,
          props.className,
        )}
        onClick={props.onClick}
      >
        {props.LeftContent && (
          <div className="flex-none">{props.LeftContent}</div>
        )}
        <div className="flex-1">{props.children}</div>
        {props.RightContent && (
          <div className="flex-none">{props.RightContent}</div>
        )}
      </button>
    </li>
  );
};

export default ButtonItem;
