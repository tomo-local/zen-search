import { evaluate } from "mathjs";

export const isCalculation = (input: string): boolean => {
  try {
    evaluate(input);
    return true;
  } catch (error) {
    return false;
  }
};
