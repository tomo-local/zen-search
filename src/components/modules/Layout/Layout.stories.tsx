import type { Meta, StoryObj } from "@storybook/react";

import Layout, { type LayoutProps } from "./Layout";

const meta: Meta = {
  component: Layout,
};

export default meta;

type Story = StoryObj<LayoutProps>;

export const Default: Story = {
  args: {
    children: (
      <>
        <h2>レイアウトタイトル</h2>
        <p>レイアウトの内容</p>
      </>
    ),
  },
};
