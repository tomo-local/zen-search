import { ServiceError, toError } from "../core/error";
import { ServiceLogger } from "../core/logger";

/** Error class for ActionService operations. */
export class ActionServiceError extends ServiceError {
  readonly code = "ACTION_SERVICE_ERROR";
}

export { toError };

/** Logger instance for use within ActionService. */
export const logger = new ServiceLogger("ActionService");
