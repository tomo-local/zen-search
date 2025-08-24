import { type ActionCalculation, ActionType } from "./types";

const SEARCH_URL = "https://www.google.com/search";

export const convertCalculationAction = (
  expression: string,
  result: number
): ActionCalculation => ({
  type: ActionType.Calculation,
  id: generateRandomId(),
  title: `${expression}=${result}`,
  url: createSearchUrl(expression),
  data: {
    expression,
    result,
  },
});

const createSearchUrl = (expression: string): string => {
  return `${SEARCH_URL}?q=${encodeURIComponent(expression)}`;
};

const generateRandomId = (): string => {
  return crypto.randomUUID();
};
