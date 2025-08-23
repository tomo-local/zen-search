import { Suggestion } from "./types";

export const convertSuggestions = (suggestions: string[]): Suggestion[] => {
  return suggestions.map((suggestion) => {
    return {
      id: randomId(),
      title: suggestion,
      url: `https://www.google.com/search?q=${encodeURIComponent(suggestion)}`,
      match: 100,
    };
  });
};

const randomId = () => {
  return Math.floor(Math.random() * 1000000);
};
