import type { Meta, StoryObj } from "@storybook/react";

import Footer, { FooterProps } from "./Footer"

const meta: Meta = {
  component: Footer,
};

export default meta;

type Story = StoryObj<FooterProps>;

export const Default: Story = {
  args: {
    children: "Footer content",
  },
};
