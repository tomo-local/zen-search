import { useEffect, useReducer } from "react";
import {
  isWindowDarkMode,
  storageService,
  type ThemeValue,
} from "@/services/storage";

export interface ThemeState {
  theme: ThemeValue;
  isDarkMode: boolean;
  setTheme: (value: ThemeValue) => void;
}

type Action =
  | { type: "INIT_THEME"; payload: ThemeValue }
  | { type: "SET_THEME"; payload: ThemeValue };

export const initialState: ThemeState = {
  theme: "system",
  isDarkMode: false,
  setTheme: () => {},
};

function themeReducer(state: ThemeState, action: Action): ThemeState {
  switch (action.type) {
    case "INIT_THEME": {
      const theme = action.payload;
      return {
        ...state,
        theme: theme,
        isDarkMode: theme === "system" ? isWindowDarkMode() : theme === "dark",
      };
    }

    case "SET_THEME": {
      console.log("+++++++++", action.payload);
      const theme = action.payload;
      storageService.setTheme({ theme });
      return {
        ...state,
        theme: theme,
        isDarkMode: theme === "system" ? isWindowDarkMode() : theme === "dark",
      };
    }
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
    (async () => {
      const storedTheme = await storageService.getTheme();
      dispatch({
        type: "INIT_THEME",
        payload: storedTheme ?? "system",
      });
    })();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [isDarkMode]);

  const setTheme = useCallback((value: ThemeValue) => {
    dispatch({ type: "SET_THEME", payload: value });
  }, []);

  return {
    theme,
    isDarkMode,
    setTheme,
  };
}
