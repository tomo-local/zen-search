import type { Meta, StoryObj } from "@storybook/react";

import Tab, { type TabProps } from "./Tab";

const meta: Meta<TabProps> = {
  component: Tab,
};

export default meta;

type Story = StoryObj<TabProps>;

export const Default: Story = {
  args: {
    children: "Tab 1",
  },
};

export const WithIcon: Story = {
  args: {
    value: "tab2",
    children: (
      <div className="flex items-center gap-2">
        <span>📝</span>
        <span>Tab with Icon</span>
      </div>
    ),
  },
};
