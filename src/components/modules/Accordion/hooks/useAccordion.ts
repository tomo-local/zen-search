import { createContext, useContext } from "react";

export interface AccordionContextType {
  isOpen: boolean;
  onToggle: () => void;
}

export const AccordionContext = createContext<AccordionContextType | undefined>(
  undefined,
);

export const useAccordion = () => {
  const context = useContext(AccordionContext);
  if (!context) {
    throw new Error("useAccordion must be used within Accordion component");
  }
  return context;
};
