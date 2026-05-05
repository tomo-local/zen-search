import { ServiceError, toError } from "../core/error";

export class ResultServiceError extends ServiceError {
  readonly code = "RESULT_SERVICE_ERROR";
}

export { toError };
