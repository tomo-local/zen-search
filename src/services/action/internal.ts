import { ServiceError, toError } from "../core/error";
import { ServiceLogger } from "../core/logger";

export class ActionServiceError extends ServiceError {
  readonly code = "ACTION_SERVICE_ERROR";
}

export { toError };

export const logger = new ServiceLogger("ActionService");
