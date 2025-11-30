import { isValidAppValue } from "./helper";
import type * as Type from "./types";

export const convertStringToAppQuery = (str: string): Type.AppQueryValue => {
  try {
    const parsed = JSON.parse(str);
    if (isValidAppValue(parsed)) {
      return parsed;
    }

    throw new Error("Invalid app query value");
  } catch (error) {
    console.error("Failed to convert string to app query:", error);
    throw new Error("Invalid app query format");
  }
};

export const convertAppQueryToString = (
  appQuery: Type.AppQueryValue,
): string => {
  try {
    return JSON.stringify(appQuery);
  } catch (error) {
    console.error("Failed to convert app query to string:", error);
    throw new Error("App query conversion failed");
  }
};
