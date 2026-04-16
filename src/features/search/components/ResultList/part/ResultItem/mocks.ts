import type { Result } from "@/services/result";

const tabItem: Result<"Tab"> = {
  type: "Tab",
  data: {
    id: 1,
    title: "Example Tab",
    url: "https://example.com",
    windowId: 1,
    favIconUrl: "https://example.com",
  },
} as Result<"Tab">;

const bookmarkItem: Result<"Bookmark"> = {
  type: "Bookmark",
  data: {
    id: "2",
    title: "Example Bookmark",
    url: "https://example.com",
  },
} as Result<"Bookmark">;

const historyItem: Result<"History"> = {
  type: "History",
  data: {
    id: "3",
    title: "Example History",
    url: "https://example.com",
  },
} as Result<"History">;

const suggestionItem: Result<"Suggestion"> = {
  type: "Suggestion",
  data: {
    type: "Google",
    suggestion: "Example Suggestion",
    title: "Example Suggestion",
    url: "https://example.com",
    query: "Example Query",
  },
} as Result<"Suggestion">;

export { tabItem, bookmarkItem, historyItem, suggestionItem };
