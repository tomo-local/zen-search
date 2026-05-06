import type { Meta, StoryObj } from "@storybook/react";

import ThemeSelectButton, {
  type ThemeSelectorProps,
} from "./ThemeSelectButton";

const meta: Meta<ThemeSelectorProps> = {
  component: ThemeSelectButton,
};

export default meta;

type Story = StoryObj<ThemeSelectorProps>;

export const Default: Story = {
  args: {},
};
