import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";
import type { Result } from "@/services/result";

import ResultList, { type ResultListProps } from "./ResultList";

const meta: Meta = {
  component: ResultList,
};

export default meta;

const tabItem: Result<"Tab"> = {
  type: "Tab",
  data: {
    id: 1,
    title: "Example Tab",
    url: "https://example.com",
    windowId: 1,
    favIconUrl: "https://example.com",
  },
} as Result<"Tab">;

const bookmarkItem: Result<"Bookmark"> = {
  type: "Bookmark",
  data: {
    id: "2",
    title: "Example Bookmark",
    url: "https://example.com",
  },
} as Result<"Bookmark">;

const historyItem: Result<"History"> = {
  type: "History",
  data: {
    id: "3",
    title: "Example History",
    url: "https://example.com",
  },
} as Result<"History">;

type Story = StoryObj<ResultListProps>;

export const Default: Story = {
  args: {
    items: [tabItem, bookmarkItem, historyItem],
    selectedIndex: 1,
    onClick: action("onClick"),
  },
};
