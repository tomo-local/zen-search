import type { ReactNode } from "react";
import { useAccordion } from "../../hooks";

export interface AccordionTitleProps {
  className?: string;
  children: ReactNode;
}

export const AccordionTitle: React.FC<AccordionTitleProps> = ({
  className,
  children,
}) => {
  const { onToggle, isOpen } = useAccordion();
  return (
    <button
      type="button"
      onClick={onToggle}
      className={className}
      aria-expanded={isOpen}
    >
      {children}
    </button>
  );
};
