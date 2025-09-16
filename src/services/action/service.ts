/**
 * Action Service - マイクロサービス形式のアクション管理サービス
 * 責任： 計算処理を担当
 */

import { convertCalculation } from "./converter";
import { calculate, isCalculation } from "./helper";
import type { Action, CalculationRequest } from "./types";

export interface ActionService {
  calculate(request: CalculationRequest): Action<"Action.Calculation">;
  isCalculation(query: string): boolean;
}

const calculateAction = (
  request: CalculationRequest,
): Action<"Action.Calculation"> => {
  const response = calculate(request.expression);

  if (!response.success) {
    throw new Error("Calculation failed");
  }

  return convertCalculation(request.expression, response.result);
};

const isAvailableCalculation = (query: string): boolean => isCalculation(query);

const createActionService = () => ({
  calculate: calculateAction,
  isCalculation: isAvailableCalculation,
});

export const actionService = createActionService();

export { calculateAction };
