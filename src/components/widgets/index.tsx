import Layout, { type LayoutProps } from "./Layout/Layout";
import ResultFooter, {
  type ResultFooterProps,
} from "./ResultFooter/ResultFooter";
import ResultLine, { type ResultLineProps } from "./ResultLine/ResultLine";
import SearchInput, { type SearchInputProps } from "./SearchInput/SearchInput";
import ThemeSelectButton, {
  type ThemeSelectorProps,
} from "./ThemeSelectButton/ThemeSelectButton";

export default {
  Layout,
  ResultFooter,
  SearchInput,
  ThemeSelectButton,
  ResultLine,
};

export type {
  LayoutProps,
  ResultFooterProps,
  ResultLineProps,
  SearchInputProps,
  ThemeSelectorProps,
};
