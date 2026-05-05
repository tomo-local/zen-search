import { ServiceError, toError } from "../core/error";
import { ServiceLogger } from "../core/logger";

export class SuggestionServiceError extends ServiceError {
  readonly code = "SUGGESTION_SERVICE_ERROR";
}

export { toError };

export const logger = new ServiceLogger("SuggestionService");
