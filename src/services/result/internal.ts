import { ServiceError, toError } from "../core/error";
import { ServiceLogger } from "../core/logger";

/** Error class for ResultService operations. */
export class ResultServiceError extends ServiceError {
  readonly code = "RESULT_SERVICE_ERROR";
}

export { toError };

/** Logger instance for use within ResultService. */
export const logger = new ServiceLogger("ResultService");
