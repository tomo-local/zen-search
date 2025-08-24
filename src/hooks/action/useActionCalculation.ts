import { useEffect, useState } from "react";
import {
  type ActionCalculation,
  actionService,
  isCalculation,
} from "@/services/action";

export const useActionCalculation = (query: string) => {
  const [result, setResult] = useState<ActionCalculation | null>(null);

  useEffect(() => {
    if (!isCalculation(query)) {
      setResult(null);
      return;
    }

    try {
      const action = actionService.calculate({ expression: query });
      setResult(action);
    } catch (error) {
      console.error("Error calculating action:", error);
      setResult(null);
    }
  }, [query]);

  return {
    result,
  };
};
