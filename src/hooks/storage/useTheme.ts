import { useEffect, useReducer } from "react";
import {
  isWindowDarkMode,
  storageService,
  type ThemeValue,
} from "@/services/storage";

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

function themeReducer(state: ThemeState, action: Action): ThemeState {
  switch (action.type) {
    case "SET_THEME": {
      const theme = action.payload;

      storageService.setTheme({ theme });

      return {
        ...state,
        theme: theme,
        isDarkMode: theme === "system" ? isWindowDarkMode() : theme === "dark",
      };
    }
    case "NEXT_THEME": {
      const themeMap = ["light", "dark", "system"] as ThemeValue[];
      const nextIndex = (themeMap.indexOf(state.theme) + 1) % themeMap.length;

      const nextTheme = themeMap[nextIndex];

      storageService.setTheme({ theme: nextTheme });

      return {
        ...state,
        theme: themeMap[nextIndex],
        isDarkMode:
          nextTheme === "system" ? isWindowDarkMode() : nextTheme === "dark",
      };
    }
    default:
      return state;
  }
}

export default function useTheme() {
  const [{ theme, isDarkMode }, dispatch] = useReducer(
    themeReducer,
    initialState,
  );

  useEffect(() => {
    const fetchTheme = async () => {
      const theme = await storageService.getTheme();
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
