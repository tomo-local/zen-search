import { ServiceError, toError } from "../core/error";
import { ServiceLogger } from "../core/logger";

export class RuntimeServiceError extends ServiceError {
  readonly code = "RUNTIME_SERVICE_ERROR";
}

export { toError };

export const logger = new ServiceLogger("RuntimeService");
