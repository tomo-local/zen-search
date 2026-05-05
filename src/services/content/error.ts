import { ServiceError, toError } from "../core/error";

export class ContentServiceError extends ServiceError {
  readonly code = "CONTENT_SERVICE_ERROR";
}

export { toError };
