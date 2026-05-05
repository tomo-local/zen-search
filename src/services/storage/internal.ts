import { ServiceError, toError } from "../core/error";
import { ServiceLogger } from "../core/logger";

export class StorageServiceError extends ServiceError {
  readonly code = "STORAGE_SERVICE_ERROR";
}

export { toError };

export const logger = new ServiceLogger("StorageService");
