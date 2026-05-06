import { ServiceError, toError } from "../core/error";
import { ServiceLogger } from "../core/logger";

/** Error class for StorageService operations. */
export class StorageServiceError extends ServiceError {
  readonly code = "STORAGE_SERVICE_ERROR";
}

export { toError };

/** Logger instance for use within StorageService. */
export const logger = new ServiceLogger("StorageService");
