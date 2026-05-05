import { ServiceError, toError } from "../core/error";

export class HistoryServiceError extends ServiceError {
  readonly code = "HISTORY_SERVICE_ERROR";
}

export { toError };
