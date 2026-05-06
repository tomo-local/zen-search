import { ServiceError, toError } from "../core/error";
import { ServiceLogger } from "../core/logger";

/** Error class for TabService operations. */
export class TabServiceError extends ServiceError {
  readonly code = "TAB_SERVICE_ERROR";
}

export { toError };

/** Logger instance for use within TabService. */
export const logger = new ServiceLogger("TabService");
