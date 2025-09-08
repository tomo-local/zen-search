import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";

import {
  bookmarkItem,
  historyItem,
  suggestionItem,
  tabItem,
} from "./part/ResultItem/mocks";
import ResultList, { type ResultListProps } from "./ResultList";

const meta: Meta = {
  component: ResultList,
};

export default meta;

type Story = StoryObj<ResultListProps>;

export const Default: Story = {
  args: {
    items: [tabItem, historyItem, suggestionItem, bookmarkItem],
    selectedIndex: 1,
    onClick: action("onClick"),
  },
};
