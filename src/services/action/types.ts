/**
 * Action Service Types -
 */

export enum ActionType {
  Calculation = "calculation",
}

export interface ActionCalculation {
  type: ActionType.Calculation;
  id: string;
  title: string;
  url: string;
  data: ActionCalculationData;
}

export interface ActionCalculationData {
  expression: string;
  result: number;
}

export interface CalculationRequest {
  expression: string;
}
