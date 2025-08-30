import type { Meta, StoryObj } from "@storybook/react";

import ResultFooter, { type ResultFooterProps } from "./ResultFooter";

const meta: Meta = {
  component: ResultFooter,
};

export default meta;

type Story = StoryObj<ResultFooterProps>;

export const Default: Story = {
  args: {
    className: "",
    loading: false,
    count: 1,
  },
};
