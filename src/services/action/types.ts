/**
 * Action Service Types -
 */

export type Kind = "Action.Calculation";

export interface Action<T extends Kind> {
  id: string;
  type: T;
  title: string;
  url: string;
  data: ActionData<T>;
}

export type ActionDataMap = {
  "Action.Calculation": ActionCalculationData;
};

export type ActionData<T extends Kind> = ActionDataMap[T];

export interface ActionCalculationData {
  expression: string;
  result: number;
  url: string;
}

export interface CalculationRequest {
  expression: string;
}
