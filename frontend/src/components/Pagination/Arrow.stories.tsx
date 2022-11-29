import Arrow from './Arrow';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'Components/Arrow',
  component: Arrow,
} as ComponentMeta<typeof Arrow>;

const Template: ComponentStory<typeof Arrow> = (args) => <Arrow {...args} />;

export const ArrowButton = Template.bind({});
ArrowButton.args = {
  direction: 'left',
  active: true,
};
