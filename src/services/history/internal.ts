import { ServiceError, toError } from "../core/error";
import { ServiceLogger } from "../core/logger";

export class HistoryServiceError extends ServiceError {
  readonly code = "HISTORY_SERVICE_ERROR";
}

export { toError };

export const logger = new ServiceLogger("HistoryService");
