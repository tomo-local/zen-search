import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";

import { bookmarkItem, historyItem, suggestionItem, tabItem } from "./mocks";
import ResultItem, { type ResultItemProps } from "./ResultItem";

const meta: Meta = {
  component: ResultItem,
};

export default meta;

type Story = StoryObj<
  ResultItemProps<"Tab" | "Bookmark" | "History" | "Suggestion">
>;

export const Default: Story = {
  args: {
    item: tabItem,
    onClick: action("onClick"),
    index: 0,
    selected: false,
  },
};

export const History: Story = {
  args: {
    item: historyItem,
    onClick: action("onClick"),
    index: 0,
    selected: false,
  },
};

export const Suggestion: Story = {
  args: {
    item: suggestionItem,
    onClick: action("onClick"),
    index: 0,
    selected: false,
  },
};

export const Bookmark: Story = {
  args: {
    item: bookmarkItem,
    onClick: action("onClick"),
    index: 0,
    selected: false,
  },
};
