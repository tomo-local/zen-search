import type { Meta, StoryObj } from "@storybook/react";

import SquareIcon, { type SquareIconProps } from "./SquareIcon";

const meta: Meta = {
  component: SquareIcon,
};

export default meta;

type Story = StoryObj<SquareIconProps>;

export const Default: Story = {
  args: {
    children: "📁",
    className: "bg-gray-100",
  },
};

export const WithCustomIcon: Story = {
  args: {
    children: (
      <div className="flex items-center justify-center w-full h-full text-2xl">
        🚀
      </div>
    ),
    className: "bg-green-100 text-green-600",
  },
};

export const ColorVariant: Story = {
  args: {
    children: "🎯",
    className: "bg-blue-100 text-blue-600",
  },
};
