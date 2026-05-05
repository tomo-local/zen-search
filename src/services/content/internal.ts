import { ServiceError, toError } from "../core/error";
import { ServiceLogger } from "../core/logger";

/** Error class for ContentService operations. */
export class ContentServiceError extends ServiceError {
  readonly code = "CONTENT_SERVICE_ERROR";
}

export { toError };

/** Logger instance for use within ContentService. */
export const logger = new ServiceLogger("ContentService");
