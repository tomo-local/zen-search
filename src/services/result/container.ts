import { actionService } from "@/services/action";
import { bookmarkService } from "@/services/bookmark";
import { historyService } from "@/services/history";
import { suggestionService } from "@/services/suggestion";
import { tabService } from "@/services/tab";

const resultServiceDependencies = {
  actionService,
  bookmarkService,
  historyService,
  suggestionService,
  tabService,
};

export default resultServiceDependencies;
