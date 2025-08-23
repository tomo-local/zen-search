import { BaseService } from "@/services/base";
import { ResultType } from "@/types/result";
import { convertSuggestions } from "./converter";
import { Suggestion, SuggestionOptions } from "./types";

export class SuggestionService extends BaseService {
  private SUGGESTION_API_URL = "https://api.example.com/suggestions";
  private Browser = "chrome";

  async initialize(): Promise<void> {
    this.isInitialized = true;
  }

  async dispose(): Promise<void> {
    this.isInitialized = false;
  }

  async getSuggestions(
    input: string,
    _option?: SuggestionOptions
  ): Promise<Suggestion[]> {
    if (!input) {
      return [];
    }

    const keyword = encodeURIComponent(input.trim());
    const endpoint = `${this.SUGGESTION_API_URL}?client=${this.Browser}&query=${keyword}`;

    try {
      const response = await fetch(endpoint, { mode: "cors" });

      if (!response.ok) {
        console.error("Failed to fetch suggestions:", response.statusText);
        return convertSuggestions([input]);
      }

      const data = await response.json();

      const suggestions = convertSuggestions(data.suggestions || [input]);
      return suggestions;
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      return convertSuggestions([input]);
    }
  }
}
