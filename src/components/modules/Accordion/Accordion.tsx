import type { ReactNode } from "react";
import { AccordionContext } from "./hooks";

export interface AccordionProps {
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  className?: string;
}

const Accordion: React.FC<AccordionProps> = ({
  isOpen,
  onToggle,
  children,
  className,
}) => {
  return (
    <AccordionContext.Provider value={{ isOpen, onToggle }}>
      <div className={className}>{children}</div>
    </AccordionContext.Provider>
  );
};

export default Accordion;
