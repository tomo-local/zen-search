import { ServiceError, toError } from "../core/error";
import { ServiceLogger } from "../core/logger";

/** Error class for HistoryService operations. */
export class HistoryServiceError extends ServiceError {
  readonly code = "HISTORY_SERVICE_ERROR";
}

export { toError };

/** Logger instance for use within HistoryService. */
export const logger = new ServiceLogger("HistoryService");
