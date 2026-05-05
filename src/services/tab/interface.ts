import type * as Type from "./types";

/** Manages browser tabs: query, create, activate, and remove. */
export interface TabService {
  /** Returns all open tabs sorted by last accessed time. */
  query: (request: Type.QueryTabsRequest) => Promise<Type.Tab[]>;
  /** Opens a new tab with the given URL. */
  create: (request: Type.CreateTabRequest) => Promise<void>;
  /** Activates the specified tab and focuses its window. */
  update: (request: Type.UpdateTabRequest) => Promise<void>;
  /** Closes the specified tab. */
  remove: (request: Type.RemoveTabRequest) => Promise<void>;
}
