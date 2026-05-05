import { ServiceError, toError } from "../core/error";

export class BookmarkServiceError extends ServiceError {
  readonly code = "BOOKMARK_SERVICE_ERROR";
}

export { toError };
