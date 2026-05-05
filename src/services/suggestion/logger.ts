import { ServiceLogger } from "../core/logger";

export const createSuggestionLogger = () =>
  new ServiceLogger("SuggestionService");
