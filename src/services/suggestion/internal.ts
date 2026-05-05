import { ServiceError, toError } from "../core/error";
import { ServiceLogger } from "../core/logger";

/** Error class for SuggestionService operations. */
export class SuggestionServiceError extends ServiceError {
  readonly code = "SUGGESTION_SERVICE_ERROR";
}

export { toError };

/** Logger instance for use within SuggestionService. */
export const logger = new ServiceLogger("SuggestionService");
