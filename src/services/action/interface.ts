import type { Action, CalculationRequest } from "./types";

/** Detects and evaluates actions. Currently handles mathematical expressions only. */
export interface ActionService {
  /** Evaluates a mathematical expression and returns the result. */
  calculate(request: CalculationRequest): Action<"Action.Calculation">;
  /** Returns true if the query is a valid mathematical expression. */
  isCalculation(query: string): boolean;
}
