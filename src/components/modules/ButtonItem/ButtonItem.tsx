import clsx from "clsx";

export interface ButtonItemProps {
  key: React.Key;
  className?: string | undefined;
  onClick?: (event: React.MouseEvent) => void;
  children: React.ReactNode;
  LeftContent?: React.ReactNode;
  RightContent?: React.ReactNode;
  selected?: boolean;
}

export const defaultClassName = {
  bg: "dark:bg-gray-800 bg-gray-50",
  border: "border-sky-500",
  selected: "dark:bg-sky-500 bg-sky-400 dark:text-black text-white",
  hover:
    "hover:dark:bg-sky-700 hover:bg-sky-300 hover:opacity-80 hover:cursor-pointer",
  icon: {
    bg: "dark:bg-gray-300 bg-slate-200",
    text: "dark:text-gray-300",
    selected: "dark:text-gray-500",
    size: "size-5",
  },
  text: "dark:text-gray-300 text-xs",
};

const ButtonItem: React.FC<ButtonItemProps> = (props) => {
  return (
    <li key={props.key} className="list-none">
      <button
        type="button"
        className={clsx(
          "flex items-center justify-between w-full px-4 py-2 text-left rounded-lg",
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
