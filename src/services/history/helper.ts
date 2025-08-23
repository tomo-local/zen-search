import { MS_IN_A_DAY } from "./constant";

export const getNow = (): Date => {
  return new Date();
};

export const get30DaysAgo = (date: Date): Date => {
  const result = new Date(date);
  result.setTime(result.getTime() - 30 * MS_IN_A_DAY);
  return result;
};
