import { generateUrl } from "./helper";
import type * as Type from "./types";

export function convertCalculation(
  expression: string,
  result: number
): Type.Action<"Action.Calculation"> {
  const url = generateUrl(expression);

  return {
    id: crypto.randomUUID(),
    type: "Action.Calculation",
    title: `${expression} = ${result}`,
    url,
    data: {
      expression,
      result,
      url,
    },
  };
}
