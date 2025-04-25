import { useEffect, useReducer } from "react";
import { getTheme, setTheme } from "@/function/chrome/storage";
import { ThemeValue } from "@/types/storage";

interface ThemeState {
  theme: ThemeValue;
  isDarkMode: boolean;
}

type Action = { type: "SET_THEME"; payload: ThemeValue };

const initialState: ThemeState = {
  theme: "system",
  isDarkMode: false,
};

function themeReducer(state: ThemeState, action: Action): ThemeState {
  switch (action.type) {
    case "SET_THEME":
      if (action.payload === "system") {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        return {
          ...state,
          theme: action.payload,
          isDarkMode: mediaQuery.matches,
        };
      }
      return {
        ...state,
        theme: action.payload,
        isDarkMode: action.payload === "dark",
      };
    default:
      return state;
  }
}

export default function useTheme() {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  useEffect(() => {
    const fetchTheme = async () => {
      const theme = await getTheme();
      dispatch({ type: "SET_THEME", payload: theme });
    };
    fetchTheme();
  }, []);

  return {
    theme: state.theme,
    isDarkMode: state.isDarkMode,
    setTheme: (value: ThemeValue) => {
      dispatch({ type: "SET_THEME", payload: value });
      setTheme(value);
    },
  };
}
