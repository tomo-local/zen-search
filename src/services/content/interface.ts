import type * as Type from "./types";

/** Opens and closes the extension popup or sidepanel. */
export interface ContentService {
  /** Opens the extension popup for the given window. */
  open: (request: Type.OpenRequest) => Promise<Type.OpenResponse>;
  /** Closes the current popup window. */
  close: () => void;
  /** Runs an action after ensuring an active tab exists. */
  openTabs: (action: () => Promise<Type.OpenResponse>) => Promise<void>;
}
