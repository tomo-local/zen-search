import { ServiceError, toError } from "../core/error";
import { ServiceLogger } from "../core/logger";

/** Error class for RuntimeService operations. */
export class RuntimeServiceError extends ServiceError {
  readonly code = "RUNTIME_SERVICE_ERROR";
}

export { toError };

/** Logger instance for use within RuntimeService. */
export const logger = new ServiceLogger("RuntimeService");
