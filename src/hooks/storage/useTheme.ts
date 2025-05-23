import { useEffect, useReducer } from "react";
import { getTheme, setTheme } from "@/function/chrome/storage";
import { ThemeValue } from "@/types/storage";

export interface ThemeState {
  theme: ThemeValue;
  isDarkMode: boolean;
}

type Action =
  | { type: "SET_THEME"; payload: ThemeValue }
  | { type: "NEXT_THEME" };

export const initialState: ThemeState = {
  theme: "system",
  isDarkMode: false,
};

const getWindowTheme = () => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
  return mediaQuery.matches;
};

function themeReducer(state: ThemeState, action: Action): ThemeState {
  switch (action.type) {
    case "SET_THEME":
      const theme = action.payload;

      setTheme(theme);

      return {
        ...state,
        theme: theme,
        isDarkMode: theme === "system" ? getWindowTheme() : theme === "dark",
      };
    case "NEXT_THEME":
      const themeMap = ["light", "dark", "system"] as ThemeValue[];
      const nextIndex = (themeMap.indexOf(state.theme) + 1) % themeMap.length;

      const nextTheme = themeMap[nextIndex];

      setTheme(nextTheme);

      return {
        ...state,
        theme: themeMap[nextIndex],
        isDarkMode:
          nextTheme === "system" ? getWindowTheme() : nextTheme === "dark",
      };
    default:
      return state;
  }
}

export default function useTheme() {
  const [{ theme, isDarkMode }, dispatch] = useReducer(
    themeReducer,
    initialState
  );

  useEffect(() => {
    const fetchTheme = async () => {
      const theme = await getTheme();
      dispatch({ type: "SET_THEME", payload: theme });
    };
    fetchTheme();
  }, []);

  return {
    theme: theme,
    isDarkMode: isDarkMode,
    setTheme: (value: ThemeValue) => {
      dispatch({ type: "SET_THEME", payload: value });
    },
    changeNextTheme: () => {
      dispatch({ type: "NEXT_THEME" });
    },
  };
}
