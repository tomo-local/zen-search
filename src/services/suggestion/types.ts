import { ResultType } from "@/types/result";

export interface SuggestionOptions {
  count?: number;
}

export interface Suggestion {
  id: number;
  type: ResultType.Google;
  title: string;
  url: string;
  match: number;
}
