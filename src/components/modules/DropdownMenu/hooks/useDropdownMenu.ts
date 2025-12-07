import { createContext, useContext } from "react";

export interface DropdownMenuContextType {
  isOpen: boolean;
  onToggle: () => void;
  selectedValue?: string;
  onSelect: (value: string) => void;
}

export const DropdownMenuContext = createContext<
  DropdownMenuContextType | undefined
>(undefined);

export const useDropdownMenu = () => {
  const context = useContext(DropdownMenuContext);
  if (!context) {
    throw new Error(
      "useDropdownMenu hook must be used within a DropdownMenu component. Please wrap your component with <DropdownMenu>!",
    );
  }
  return context;
};
