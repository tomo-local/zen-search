import type { Meta, StoryObj } from "@storybook/react";

import Modal, { type ModalProps } from "./Modal";

const meta: Meta = {
  component: Modal,
};

export default meta;

type Story = StoryObj<ModalProps>;

export const Default: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    children: (
      <div className="p-4 text-gray-700 dark:text-gray-200">
        <h2 className="mb-2 text-lg font-bold">モーダルタイトル</h2>
        <p>モーダルの内容</p>
      </div>
    ),
  },
};
