import { useReducer } from "react";
import { ResultType } from "@/types/result";
import { ngramSimilarity } from "@/utils/algorithm";

interface QueryState {
  type: ResultType;
  query: string;
  suggestion: ResultType | null;
}

type QueryAction =
  | { type: "type"; value: ResultType }
  | { type: "query"; value: string }
  | { type: "suggestion"; value: ResultType | null }
  | { type: "resetType" };

const initialState: QueryState = {
  type: ResultType.All,
  suggestion: null,
  query: "",
};

const matchType = (query: string) => {
  const count = query.length;

  if (count < 1) {
    return null;
  }

  const lowerQuery = query.toLowerCase();

  const types = Object.values(ResultType);

  const match = types.find((type) => {
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

const queryReducer = (state: QueryState, action: QueryAction): QueryState => {
  switch (action.type) {
    case "type":
      return { ...state, type: action.value, query: "", suggestion: null };

    case "query":
      const suggestion =
        state.type === ResultType.All ? matchType(action.value) : null;

      return { ...state, query: action.value, suggestion };

    case "resetType": {
      if (state.type === ResultType.All) {
        return state;
      }

      return {
        ...state,
        type: ResultType.All,
        query: state.type,
        suggestion: state.type,
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
    setQuery: updateQuery,
    setType: updateType,
    reset,
  };
}
