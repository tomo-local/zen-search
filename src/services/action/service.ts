/**
 * Action Service - マイクロサービス形式のアクション管理サービス
 * 責任： 計算処理を担当
 */

import { convertCalculationAction } from "./converter";
import { calculate } from "./helper";
import type { ActionCalculation, CalculationRequest } from "./types";

export interface ActionService {
  calculate(request: CalculationRequest): ActionCalculation;
}

const calculateAction = (request: CalculationRequest): ActionCalculation => {
  const response = calculate(request.expression);

  if (!response.success) {
    throw new Error("Calculation failed");
  }

  return convertCalculationAction(request.expression, response.result);
};

const createActionService = () => ({
  calculate: calculateAction,
});

export const actionService = createActionService();

export { calculateAction };
