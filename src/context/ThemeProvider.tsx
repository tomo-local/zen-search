import { createContext, useContext, useMemo, ReactNode } from "react";
import useTheme from "@/hooks/storage/useTheme";
import { ThemeValue } from "@/types/storage";
interface ThemeContextType {
  theme: ThemeValue;
  isDarkMode: boolean;
  setTheme: (value: ThemeValue) => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

type setTheme = {
  children: React.ReactNode;
};
const ThemeProvider = (props: setTheme) => {
  const { theme, isDarkMode, setTheme } = useTheme();

  const contextValue = useMemo(
    () => ({
      theme,
      isDarkMode,
      setTheme,
    }),
    [theme, isDarkMode, setTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      <div className={`${isDarkMode ? "dark" : "light"}`}>{props.children}</div>
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};

export default ThemeProvider;
