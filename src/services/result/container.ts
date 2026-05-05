import { actionService } from "@/services/action";
import { bookmarkService } from "@/services/bookmark";
import { historyService } from "@/services/history";
import { storageService } from "@/services/storage";
import { suggestionService } from "@/services/suggestion";
import { tabService } from "@/services/tab";

const resultServiceDependencies = {
  actionService,
  bookmarkService,
  historyService,
  storageService,
  suggestionService,
  tabService,
};

export default resultServiceDependencies;
