/**
 * useSearch関連のReducer
 */

import { defaultCategories } from "./constants";
import type { QueryAction, QueryState } from "./types";

/**
 * クエリ状態を管理するReducer
 */
export function queryReducer(
  state: QueryState,
  action: QueryAction,
): QueryState {
  switch (action.type) {
    case "type":
      return {
        ...state,
        type: action.value,
        query: "",
        suggestion: null,
      };

    case "category": {
      return {
        ...state,
        categories: action.value,
      };
    }

    case "query": {
      return {
        ...state,
        query: action.value,
      };
    }

    case "suggestion": {
      return {
        ...state,
        suggestion: action.value,
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
}
