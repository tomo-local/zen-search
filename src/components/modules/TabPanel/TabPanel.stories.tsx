import type { Meta, StoryObj } from "@storybook/react";

import TabPanel, { type TabPanelProps } from "./TabPanel";

const meta: Meta<TabPanelProps> = {
  component: TabPanel,
};

export default meta;

type Story = StoryObj<TabPanelProps>;

export const Default: Story = {
  args: {
    value: "tab1",
    children: "This is the content for Tab 1",
  },
};

export const WithHTML: Story = {
  args: {
    value: "tab2",
    children: (
      <div>
        <h2>Tab 2 Content</h2>
        <p>This panel contains more complex HTML content.</p>
      </div>
    ),
  },
};
