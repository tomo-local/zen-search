import { ServiceError, toError } from "../core/error";
import { ServiceLogger } from "../core/logger";

export class ResultServiceError extends ServiceError {
  readonly code = "RESULT_SERVICE_ERROR";
}

export { toError };

export const logger = new ServiceLogger("ResultService");
