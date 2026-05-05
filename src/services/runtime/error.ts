import { ServiceError, toError } from "../core/error";

export class RuntimeServiceError extends ServiceError {
  readonly code = "RUNTIME_SERVICE_ERROR";
}

export { toError };
