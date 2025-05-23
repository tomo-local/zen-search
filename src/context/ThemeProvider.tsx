import { createContext } from "react";
import useTheme, {
  type ThemeState,
  initialState,
} from "@/hooks/storage/useTheme";
import { ThemeValue } from "@/types/storage";

type Props = {
  children: React.ReactNode;
};

type ThemeContextType = ThemeState & {
  setTheme: (value: ThemeValue) => void;
  changeNextTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({
  ...initialState,
  setTheme: () => {},
  changeNextTheme: () => {},
});

const ThemeProvider = (props: Props) => {
  const { theme, isDarkMode, setTheme, changeNextTheme } = useTheme();

  return (
    <ThemeContext.Provider
      value={{ theme, isDarkMode, changeNextTheme, setTheme }}
    >
      <div className={`theme-${theme} ${isDarkMode ? "dark" : ""}`}>
        {props.children}
      </div>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
