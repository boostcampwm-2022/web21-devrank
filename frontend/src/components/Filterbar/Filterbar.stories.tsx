import Filterbar from './index';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'Components/Filterbar',
  component: Filterbar,
} as ComponentMeta<typeof Filterbar>;

const Template: ComponentStory<typeof Filterbar> = (args) => <Filterbar {...args} />;

export const Default = Template.bind({});

export const Filtered = Template.bind({});
Filtered.args = {
  active: 'orange',
};
