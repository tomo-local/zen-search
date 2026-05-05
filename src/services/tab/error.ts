import { ServiceError, toError } from "../core/error";

export class TabServiceError extends ServiceError {
  readonly code = "TAB_SERVICE_ERROR";
}

export { toError };
