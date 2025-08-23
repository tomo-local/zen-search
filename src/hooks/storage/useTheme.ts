import { useEffect, useReducer } from "react";
import { StorageService, SyncStorage, SyncStorageKey } from "@/services/storage"

const storage = new StorageService();

type Theme = SyncStorage[SyncStorageKey.Theme]

export interface ThemeState {
  theme: Theme;
  isDarkMode: boolean;
}

type Action =
  | { type: "SET_THEME"; payload: Theme }
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

      storage.setTheme(theme);

      return {
        ...state,
        theme: theme,
        isDarkMode: theme === "system" ? getWindowTheme() : theme === "dark",
      };
    case "NEXT_THEME":
      const themeMap = ["light", "dark", "system"] as Theme[];
      const nextIndex = (themeMap.indexOf(state.theme) + 1) % themeMap.length;

      const nextTheme = themeMap[nextIndex];

      storage.setTheme(nextTheme);

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
      const theme = await storage.getTheme();
      dispatch({ type: "SET_THEME", payload: theme });
    };
    fetchTheme();
  }, []);

  return {
    theme: theme,
    isDarkMode: isDarkMode,
    setTheme: (value: Theme) => {
      dispatch({ type: "SET_THEME", payload: value });
    },
    changeNextTheme: () => {
      dispatch({ type: "NEXT_THEME" });
    },
  };
}
