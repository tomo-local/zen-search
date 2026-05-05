import { ServiceError, toError } from "../core/error";
import { ServiceLogger } from "../core/logger";

export class BookmarkServiceError extends ServiceError {
  readonly code = "BOOKMARK_SERVICE_ERROR";
}

export { toError };

export const logger = new ServiceLogger("BookmarkService");
