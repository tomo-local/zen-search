import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Accordion from "../../Accordion";
import { AccordionTitle } from "./AccordionTitle";

const meta: Meta = {
  component: AccordionTitle,
  decorators: [
    (Story) => {
      const [isOpen, setIsOpen] = useState(false);
      return (
        <Accordion isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
          <Story />
        </Accordion>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof AccordionTitle>;

export const Default: Story = {
  render: () => <AccordionTitle>Click to toggle</AccordionTitle>,
};

export const WithCustomContent: Story = {
  render: () => (
    <AccordionTitle>
      <h2>Custom Title</h2>
    </AccordionTitle>
  ),
};
