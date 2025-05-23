import React from "react";

interface ResultItemProps {
  key: React.Key;
  className?: string | undefined;
  onClick?: (event: React.MouseEvent) => void;
  children: React.ReactNode;
  LeftContent?: React.ReactNode;
  RightContent?: React.ReactNode;
  isSelected: boolean;
}

export const commonClassName = {
  bg: "dark:bg-gray-800 bg-gray-50",
  border: "border-sky-500",
  selected: "dark:bg-sky-500 bg-sky-400",
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

export default function CommonItem({
  key,
  className,
  onClick,
  LeftContent,
  RightContent,
  children,
}: ResultItemProps) {
  return (
    <li key={key}>
      <button
        type="button"
        className={`
        flex items-center justify-between w-full px-4 py-2 text-left rounded-lg
        ${className}
      `}
        onClick={onClick}
      >
        <div className="flex items-center min-w-full space-x-2">
          {LeftContent && <div className="flex-none">{LeftContent}</div>}
          <div className="flex-1">{children}</div>
          {RightContent && <div className="flex-none">{RightContent}</div>}
        </div>
      </button>
    </li>
  );
}
