import type { ReactNode } from "react";
import { useDropdownMenu } from "../../hooks";

export interface DropdownMenuButtonProps {
  className?: string;
  children: ReactNode;
}

export const DropdownMenuButton: React.FC<DropdownMenuButtonProps> = ({
  className,
  children,
}) => {
  const { onToggle, isOpen } = useDropdownMenu();

  return (
    <button
      type="button"
      onClick={onToggle}
      className={className}
      aria-expanded={isOpen}
      aria-haspopup="true"
    >
      {children}
    </button>
  );
};
