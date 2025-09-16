import { evaluate } from "mathjs";

// 数値と計算符号の両方がある場合にtrueを返す
export const isCalculation = (input: string): boolean => {
  const regex = /[0-9]+(\s*[+\-*/]\s*[0-9]+)+/;
  return regex.test(input);
};

export const calculate = (
  input: string
): {
  success: boolean;
  result: number;
} => {
  try {
    const result = evaluate(input);

    return {
      success: true,
      result: result,
    };
  } catch (error) {
    console.error("Calculation error:", error);
    return {
      success: false,
      result: 0,
    };
  }
};

export const generateUrl = (expression: string): string => {
  return `https://www.google.com/search?q=${encodeURIComponent(expression)}`;
};
