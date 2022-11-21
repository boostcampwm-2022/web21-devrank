import Filterbar from './index';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'Components/Filterbar',
  component: Filterbar,
} as ComponentMeta<typeof Filterbar>;

const Template: ComponentStory<typeof Filterbar> = (args) => <Filterbar {...args} />;

export const Basic = Template.bind({});

Basic.args = {
  active: 'yellow',
};
