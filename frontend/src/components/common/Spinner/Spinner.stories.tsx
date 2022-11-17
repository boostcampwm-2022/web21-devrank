import { ComponentMeta, ComponentStory } from '@storybook/react';
import Spinner from '@components/common/Spinner';

export default {
  title: 'Components/Spinner',
  component: Spinner,
} as ComponentMeta<typeof Spinner>;

const Template: ComponentStory<typeof Spinner> = (args) => <Spinner {...args} />;

export const Small = Template.bind({});
Small.args = {
  width: 50,
  height: 50,
};

export const Medium = Template.bind({});
Medium.args = {
  width: 100,
  height: 100,
};

export const Large = Template.bind({});
Large.args = {
  width: 200,
  height: 200,
};
