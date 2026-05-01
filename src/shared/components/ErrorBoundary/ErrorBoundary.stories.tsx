import type { Meta, StoryObj } from "@storybook/react";

import ErrorBoundary, { type ErrorBoundaryProps } from "./ErrorBoundary";

const meta: Meta = {
  component: ErrorBoundary,
};

export default meta;

type Story = StoryObj<ErrorBoundaryProps>;

function ThrowError(): never {
  throw new Error("Unexpected render error");
}

export const Default: Story = {
  args: {
    children: <div className="p-4 text-sm">正常なコンテンツ</div>,
  },
};

export const WithError: Story = {
  args: {
    children: <ThrowError />,
  },
};

export const WithCustomFallback: Story = {
  args: {
    children: <ThrowError />,
    fallback: (
      <div className="p-4 text-sm text-yellow-500">カスタムフォールバック</div>
    ),
  },
};
