import BookmarkItem, {
  type BookmarkItemProps,
} from "./BookmarkItem/BookmarkItem";
import HistoryItem, { type HistoryItemProps } from "./HistoryItem/HistoryItem";
import ResultFooter, {
  type ResultFooterProps,
} from "./ResultFooter/ResultFooter";
import ResultLine, { type ResultLineProps } from "./ResultLine/ResultLine";
import SearchInput, { type SearchInputProps } from "./SearchInput/SearchInput";
import SuggestionItem, {
  type SuggestionItemProps,
} from "./SuggestionItem/SuggestionItem";
import TabItem, { type TabItemProps } from "./TabItem/TabItem";
import ThemeSelectButton, {
  type ThemeSelectorProps,
} from "./ThemeSelectButton/ThemeSelectButton";

export default {
  ResultFooter,
  SearchInput,
  ThemeSelectButton,
  ResultLine,
  SuggestionItem,
  HistoryItem,
  BookmarkItem,
  TabItem,
};

export type {
  ResultFooterProps,
  ResultLineProps,
  SearchInputProps,
  ThemeSelectorProps,
  SuggestionItemProps,
  HistoryItemProps,
  BookmarkItemProps,
  TabItemProps,
};
