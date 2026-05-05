import { ServiceError, toError } from "../core/error";

export class StorageServiceError extends ServiceError {
  readonly code = "STORAGE_SERVICE_ERROR";
}

export { toError };
