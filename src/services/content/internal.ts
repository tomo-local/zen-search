import { ServiceError, toError } from "../core/error";
import { ServiceLogger } from "../core/logger";

export class ContentServiceError extends ServiceError {
  readonly code = "CONTENT_SERVICE_ERROR";
}

export { toError };

export const logger = new ServiceLogger("ContentService");
