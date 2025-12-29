import { createContext } from "react";
import useTheme, {
  initialState,
  type ThemeState,
} from "@/hooks/storage/useTheme";
import type { ThemeValue } from "@/services/storage";

type Props = {
  children: React.ReactNode;
};

type ThemeContextType = ThemeState & {
  setTheme: (value: ThemeValue) => void;
};

export const ThemeContext = createContext<ThemeContextType>(initialState);

const ThemeProvider = (props: Props) => {
  const { theme, isDarkMode, setTheme } = useTheme();

  return (
    <ThemeContext.Provider value={{ theme, isDarkMode, setTheme }}>
      {props.children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
