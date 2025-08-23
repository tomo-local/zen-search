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
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
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
