import { ServiceError, toError } from "../core/error";

export class ActionServiceError extends ServiceError {
  readonly code = "ACTION_SERVICE_ERROR";
}

export { toError };
