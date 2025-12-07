import clsx from "clsx";
import type { ReactNode } from "react";
import { DropdownMenuContext } from "./hooks";

export interface DropdownMenuProps {
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  className?: string;
  selectedValue?: string;
  onSelect: (value: string) => void;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({
  isOpen,
  onToggle,
  children,
  className,
  selectedValue,
  onSelect,
}) => {
  return (
    <DropdownMenuContext.Provider
      value={{
        isOpen,
        onToggle,
        selectedValue,
        onSelect,
      }}
    >
      <div className={clsx("relative", className)}>{children}</div>
    </DropdownMenuContext.Provider>
  );
};

export default DropdownMenu;
