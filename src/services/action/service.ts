/**
 * Action Service - マイクロサービス形式のアクション管理サービス
 * 責任： 計算処理を担当
 */

import { convertCalculation } from "./converter";
import { ActionServiceError } from "./error";
import { calculate, isCalculation } from "./helper";
import type { ActionService } from "./interface";
import { createActionLogger } from "./logger";
import type { Action, CalculationRequest } from "./types";

const logger = createActionLogger();

const calculateAction = (
  request: CalculationRequest,
): Action<"Action.Calculation"> => {
  const response = calculate(request.expression);

  if (!response.success) {
    logger.error("Calculation failed", undefined, {
      expression: request.expression,
    });
    throw new ActionServiceError("Failed to evaluate expression");
  }

  return convertCalculation(request.expression, response.result);
};

const isAvailableCalculation = (query: string): boolean => isCalculation(query);

const createActionService = (): ActionService => ({
  calculate: calculateAction,
  isCalculation: isAvailableCalculation,
});

export const actionService = createActionService();

export { calculateAction };
