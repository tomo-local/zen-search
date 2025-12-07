import clsx from "clsx";
import type { ReactNode } from "react";
import { useDropdownMenu } from "../../hooks";

export interface DropdownMenuItemProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export const DropdownMenuItem: React.FC<DropdownMenuItemProps> = ({
  value,
  children,
  className,
  disabled = false,
}) => {
  const { onSelect } = useDropdownMenu();

  const handleSelect = () => {
    if (disabled) return;
    onSelect(value);
  };

  return (
    <button
      type="button"
      onClick={handleSelect}
      className={clsx(
        "w-full px-3 py-2 text-left transition-colors",
        className,
      )}
      role="menuitem"
      disabled={disabled}
    >
      {children}
    </button>
  );
};
