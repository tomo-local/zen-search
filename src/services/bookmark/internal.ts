import { ServiceError, toError } from "../core/error";
import { ServiceLogger } from "../core/logger";

/** Error class for BookmarkService operations. */
export class BookmarkServiceError extends ServiceError {
  readonly code = "BOOKMARK_SERVICE_ERROR";
}

export { toError };

/** Logger instance for use within BookmarkService. */
export const logger = new ServiceLogger("BookmarkService");
