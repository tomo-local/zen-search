import type {
  Kind,
  QueryResultsRequest,
  Result,
} from "@/services/result/types";
import type {
  CreateTabRequest,
  RemoveTabRequest,
  UpdateTabRequest,
} from "@/services/tab/types";

/** IPC bridge between UI and the background service worker. */
export interface RuntimeService {
  /** Opens a new tab via the background. */
  createTab: (request: CreateTabRequest) => Promise<void>;
  /** Activates a tab via the background. */
  updateTab: (request: UpdateTabRequest) => Promise<void>;
  /** Closes a tab via the background. */
  removeTab: (request: RemoveTabRequest) => Promise<void>;
  /** Queries all result sources via the background. */
  queryResults: (request: QueryResultsRequest) => Promise<Result<Kind>[]>;
  /** Opens the extension popup or sidepanel. */
  openContent: () => Promise<void>;
  /** Closes the current popup window. */
  closeContent: () => void;
  /**
   * Establishes a persistent port connection to prevent MV3 service worker idle termination.
   * Automatically reconnects if the connection is dropped.
   */
  connectPort: (name: string, onMessage?: (message: unknown) => void) => void;
}
