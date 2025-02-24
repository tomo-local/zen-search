type ListType = "all" | "search" | "tab" | "history" | "bookmark";

type ListContext =
  | SearchContext
  | TabContext
  | HistoryContext
  | BookmarkContext;

type SearchContext = {
  type: "search";
  title: string;
  url: string;
};

type TabContext = {
  type: "tab";
  title: string;
  icon: string;
  id: number;
};

type HistoryContext = {
  type: "history";
  title: string;
  url: string;
};

type BookmarkContext = {
  type: "bookmark";
  title: string;
  url: string;
};

export { ListType, ListContext };
