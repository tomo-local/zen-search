import type { Meta, StoryObj } from "@storybook/react";

import SquareBadge, { type SquareBadgeProps } from "./SquareBadge";

const meta: Meta = {
  component: SquareBadge,
};

export default meta;

type Story = StoryObj<SquareBadgeProps>;

export const Default: Story = {
  args: {
    children: "スクエア",
    className: "bg-blue-500",
  },
};

export const WithIcon: Story = {
  args: {
    children: (
      <>
        <span className="mr-1">🎯</span>
        タグ
      </>
    ),
    className: "bg-purple-500",
  },
};

export const LongText: Story = {
  args: {
    children: "長いテキスト例",
    className: "bg-gray-500",
  },
};
