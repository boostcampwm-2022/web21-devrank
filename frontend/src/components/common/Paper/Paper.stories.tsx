import Paper from '.';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'Components/Paper',
  component: Paper,
  argTypes: {
    fill: { control: 'color' },
  },
} as ComponentMeta<typeof Paper>;

const Template: ComponentStory<typeof Paper> = (args) => <Paper {...args} />;

export const Basic = Template.bind({});

export const ChangeColor = Template.bind({});
ChangeColor.args = {
  fill: '#A5A5A5',
};
