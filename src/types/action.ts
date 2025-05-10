export enum ActionType {
  Calculation= "calculation",
}

export type CommonAction = {
  type: ActionType;
  id: number;
  title: string;
  url: string;
  match: number;
};

export type Calculation = CommonAction & {
  calculation: {
    expression: string;
    result: number;
  }
}

export type Action = Calculation;