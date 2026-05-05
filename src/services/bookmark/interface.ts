import type * as Type from "./types";

/** Searches and retrieves browser bookmarks. */
export interface BookmarkService {
  /** Searches bookmarks by query, or returns all if no query is provided. */
  query: (request: Type.QueryBookmarksRequest) => Promise<Type.Bookmark[]>;
  /** Returns the most recently added bookmarks. */
  getRecent: (
    request: Type.GetRecentBookmarksRequest,
  ) => Promise<Type.Bookmark[]>;
}
