import { Meta, StoryObj } from "@storybook/react";

import Spinner, { SpinnerProps } from "./Spinner";

const meta: Meta = {
  component: Spinner,
};

export default meta;

type Story = StoryObj<SpinnerProps>;

export const Default: Story = {
  args: {
    active: true,
    size: "md",
  },
};

export const Xs: Story = {
  args: {
    active: true,
    size: "xs",
  },
};

export const Sm: Story = {
  args: {
    active: true,
    size: "sm",
  },
};

export const Lg: Story = {
  args: {
    active: true,
    size: "lg",
  },
};

export const Xl: Story = {
  args: {
    active: true,
    size: "xl",
  },
};
