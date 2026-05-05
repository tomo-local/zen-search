import { ServiceError, toError } from "../core/error";

export class SuggestionServiceError extends ServiceError {
  readonly code = "SUGGESTION_SERVICE_ERROR";
}

export { toError };
