import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";

import HistoryItem, { type HistoryItemProps } from "./HistoryItem";

const meta: Meta = {
  component: HistoryItem,
};

export default meta;

type Story = StoryObj<HistoryItemProps>;

export const Default: Story = {
  args: {
    item: {
      data: {
        id: "1",
        title: "Example History Item",
        url: "https://example.com",
      },
    },
    onClick: action("clicked"),
    selected: false,
  },
};
