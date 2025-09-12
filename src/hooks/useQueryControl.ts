import { useReducer } from "react";
import type { Kind } from "@/services/result";
import { ngramSimilarity } from "@/utils/algorithm";

type ResultType = "All" | "Tab" | "History" | "Bookmark" | "Google";

interface QueryState {
  type: ResultType;
  query: string;
  categories: Kind[];
  suggestion: ResultType | null;
  init: boolean;
}

type QueryAction =
  | { type: "type"; value: ResultType }
  | { type: "query"; value: string }
  | { type: "suggestion"; value: ResultType | null }
  | { type: "resetType" };

const defaultCategories: Kind[] = ["Tab", "History", "Bookmark", "Suggestion"];

const initialState: QueryState = {
  type: "All",
  categories: [...defaultCategories],
  suggestion: null,
  query: "",
  init: false,
};

const matchType = (query: string) => {
  const count = query.length;

  if (count < 1) {
    return null;
  }

  const lowerQuery = query.toLowerCase();

  const match = ["All", "Tab", "History", "Bookmark", "Google"].find((type) => {
    const lowerType = type.toLowerCase();

    if (lowerType.length < lowerQuery.length) {
      return false;
    }

    if (lowerType === lowerQuery) {
      return true;
    }

    const similarity = ngramSimilarity(lowerQuery, lowerType);

    return similarity;
  });

  return match ? (match as ResultType) : null;
};

const categoriesMap: { [key in ResultType]: Kind[] } = {
  All: defaultCategories,
  Tab: ["Tab"],
  History: ["History"],
  Bookmark: ["Bookmark"],
  Google: ["Suggestion"],
};

const queryReducer = (state: QueryState, action: QueryAction): QueryState => {
  switch (action.type) {
    case "type":
      return {
        ...state,
        type: action.value,
        query: "",
        suggestion: null,
        categories: categoriesMap[action.value],
      };

    case "query": {
      const suggestion = state.type === "All" ? matchType(action.value) : null;

      if (state.init) {
        return {
          ...state,
          query: action.value,
          suggestion,
          init: false,
          categories: [...defaultCategories],
        };
      }

      return {
        ...state,
        query: action.value,
        suggestion,
      };
    }

    case "resetType": {
      if (state.type === "All") {
        return state;
      }

      return {
        ...state,
        type: "All",
        query: state.type,
        suggestion: state.type,
        categories: defaultCategories,
      };
    }
    default:
      return state;
  }
};

export default function useQueryControl() {
  const [state, dispatch] = useReducer(queryReducer, initialState);

  const updateQuery = (query: string) => {
    dispatch({ type: "query", value: query });
  };

  const updateType = (type: ResultType) => {
    dispatch({ type: "type", value: type });
  };

  const reset = () => {
    dispatch({ type: "resetType" });
  };

  return {
    query: state.query,
    type: state.type,
    suggestion: state.suggestion,
    categories: state.categories,
    setQuery: updateQuery,
    setType: updateType,
    reset,
  };
}
