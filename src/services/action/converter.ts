import { generateUrl } from "./helper";
import type * as Type from "./types";

export function convertCalculation(
  expression: string,
  result: number,
): Type.Action<"Action.Calculation"> {
  return {
    id: crypto.randomUUID(),
    type: "Action.Calculation",
    title: `${expression} = ${result}`,
    url: generateUrl(expression),
    data: {
      expression,
      result,
      url: generateUrl(expression),
    },
  };
}
