import React from "react";

interface ResultItemProps {
  key: React.Key;
  className?: string | undefined;
  onClick?: (event: React.MouseEvent) => void;
  children: React.ReactNode;
  leftContent?: React.ReactNode;
  rightContent?: React.ReactNode;
  isSelected: boolean;
}

export default function CommonItem({
  key,
  className,
  onClick,
  leftContent,
  rightContent,
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
          {leftContent && <div className="flex-none">{leftContent}</div>}
          <div className="flex-1">{children}</div>
          {rightContent && <div className="flex-none">{rightContent}</div>}
        </div>
      </button>
    </li>
  );
}
