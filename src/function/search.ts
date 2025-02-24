type SearchTabInput = {
  query: string;
  option?: {
    count?: number;
  };
};

const searchTabSearch = async ({ query, option }: SearchTabInput) => {
  const allWindows = await chrome.windows.getAll({
    windowTypes: ["normal"],
  });

  const notFocusedWindowIds = allWindows.map((window) => window.id);

  const currentWindows = await chrome.windows.getCurrent();

  if (currentWindows) {
    notFocusedWindowIds.unshift(currentWindows.id);
  }

  const allTabs = await Promise.all(
    [...new Set(notFocusedWindowIds)].map((windowId) =>
      chrome.tabs.query({ windowId })
    )
  ).then((results) => results.flat());

  const exactMatches = allTabs.filter((tab) =>
    tab?.title?.toLowerCase().includes(query.toLowerCase())
  );

  if (exactMatches.length === 0) {
    return [];
  }

  return option?.count ? exactMatches.slice(0, option.count) : exactMatches;
};

type Term = {
  start: number;
  end: number;
};

type SearchHistorySearchInput = {
  query: string;
  option?: {
    term?: Term;
    count?: number;
  };
  callback?: (
    results: chrome.history.HistoryItem[]
  ) => chrome.history.HistoryItem[];
};

const searchHistorySearch = async ({
  query,
  option,
}: SearchHistorySearchInput) => {
  if (query === "") {
    return [];
  }

  const splitQuery = query.split("|").map((q) => q.trim());

  const response = await Promise.all(
    splitQuery.map((q) =>
      chrome.history.search({
        text: q,
        startTime: option?.term?.start,
        endTime: option?.term?.end,
        maxResults: option?.count || 20,
      })
    )
  );

  return response.flat() as chrome.history.HistoryItem[];
};

type SearchSuggestionsInput = {
  query: string;
  option?: {
    count?: number;
  };
};

const searchSuggestions = async ({ query, option }: SearchSuggestionsInput) => {
  const apiUrl = `https://www.google.com/complete/search?q=${encodeURIComponent(
    query
  )}&client=chrome`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const suggestions = (data[1] as String[]) || []; // 候補がない場合は空配列を返す

    return option?.count ? suggestions.slice(0, option?.count) : suggestions;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
};

const searchBookmarkSearch = async ({ query, option }: SearchTabInput) => {
  try {
    const bookmarks = await chrome.bookmarks.search(query);
    return option?.count ? bookmarks.slice(0, option.count) : bookmarks;
  } catch (error) {
    console.error("Error fetching bookmarks:", error);
    return [];
  }
};

export {
  searchTabSearch,
  searchHistorySearch,
  searchSuggestions,
  searchBookmarkSearch,
};
