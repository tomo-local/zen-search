import { ServiceError, toError } from "../core/error";
import { ServiceLogger } from "../core/logger";

export class TabServiceError extends ServiceError {
  readonly code = "TAB_SERVICE_ERROR";
}

export { toError };

export const logger = new ServiceLogger("TabService");
