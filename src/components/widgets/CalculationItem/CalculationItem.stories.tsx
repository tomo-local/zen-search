import { action } from "@storybook/addon-actions";
import type { Meta, StoryObj } from "@storybook/react";

import CalculationItem, { type CalculationItemProps } from "./CalculationItem";

const meta: Meta = {
  component: CalculationItem,
};

export default meta;

type Story = StoryObj<CalculationItemProps>;

export const Default: Story = {
  args: {
    item: {
      data: {
        expression: "12 / 3 + 5 * (2 - 8)",
        result: 11,
        url: "https://www.google.com/search?q=12+%2F+3+%2B+5+*+%282+-+8%29",
      },
    },
    selected: false,
    onClick: action("clicked"),
  },
};
