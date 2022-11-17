import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Dropdown, DropdownItem } from '@components/common';

export default {
  title: 'Components/Dropdown',
  component: Dropdown,
  subcomponents: { DropdownItem },
} as ComponentMeta<typeof Dropdown>;

const Template: ComponentStory<typeof Dropdown> = (args) => <Dropdown {...args} />;

export const Language = Template.bind({});
