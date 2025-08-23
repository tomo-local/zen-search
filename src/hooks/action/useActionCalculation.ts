import { useState } from "react";
import { type Action, ActionType } from "@/types/action";
import { calculate, isCalculation } from "@/utils/calculation";

export const useActionCalculation = (query: string) => {
  const [result, setResult] = useState<Action | null>(null);

  useEffect(() => {
    if (!isCalculation(query)) {
      setResult(null);
      return;
    }

    const calculationResult = calculate(query);

    if (!calculationResult.success) {
      setResult(null);
      return;
    }

    const action: Action = {
      type: ActionType.Calculation,
      id: Date.now(),
      title: `${query}=${calculationResult}`,
      url: `https://www.google.com/search?q=${encodeURIComponent(query)}`,
      match: 1,
      calculation: {
        expression: query,
        result: calculationResult.result,
      },
    };
    setResult(action);
  }, [query]);

  return {
    result,
  };
};
