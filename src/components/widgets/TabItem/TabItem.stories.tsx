import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";

import TabItem, { type TabItemProps } from "./TabItem";

const meta: Meta = {
  component: TabItem,
};

export default meta;

type Story = StoryObj<TabItemProps>;

export const Default: Story = {
  args: {
    item: {
      data: {
        id: 1,
        title:
          "あ\nあああああああああああああああああああああああああああああああああああああああああああああああああああああああああああああ",
        url: "https://example.com",
        favIconUrl: "https://example.com/favicon.ico",
      },
    },
    onClick: action("onClick"),
    selected: false,
  },
};
