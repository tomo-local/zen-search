import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import Accordion from "../../Accordion";
import { AccordionContent } from "./AccordionContent";

const meta: Meta = {
  component: AccordionContent,
  decorators: [
    (Story) => {
      const [isOpen, setIsOpen] = useState(true);
      return (
        <Accordion isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)}>
          <Story />
        </Accordion>
      );
    },
  ],
};

export default meta;

type Story = StoryObj<typeof AccordionContent>;

export const Default: Story = {
  render: () => (
    <AccordionContent>
      <p>
        This is the accordion content that can expand and collapse smoothly.
      </p>
    </AccordionContent>
  ),
};

export const WithCustomContent: Story = {
  render: () => (
    <AccordionContent>
      <div>
        <h3>Detailed Content</h3>
        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        <ul>
          <li>Item 1</li>
          <li>Item 2</li>
          <li>Item 3</li>
        </ul>
      </div>
    </AccordionContent>
  ),
};
