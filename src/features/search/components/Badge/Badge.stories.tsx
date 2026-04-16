import type { Meta, StoryObj } from "@storybook/react";

import Badge, { type BadgeProps } from "./Badge";

const meta: Meta = {
  component: Badge,
};

export default meta;

type Story = StoryObj<BadgeProps>;

export const Default: Story = {
  args: {
    label: "バッジ",
    className: "bg-blue-500",
  },
};

export const WithCount: Story = {
  args: {
    label: "通知",
    count: 5,
    className: "bg-red-500",
  },
};

export const CustomStyle: Story = {
  args: {
    label: "カスタム",
    count: 10,
    className: "bg-green-500",
  },
};
