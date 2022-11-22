import { ComponentMeta, ComponentStory } from '@storybook/react';
import Spinner from '@components/common/Spinner';

export default {
  title: 'Components/Spinner',
  component: Spinner,
} as ComponentMeta<typeof Spinner>;

const Template: ComponentStory<typeof Spinner> = (args) => <Spinner {...args} />;

export const Small = Template.bind({});
Small.args = {
  size: 50,
};

export const Medium = Template.bind({});
Medium.args = {
  size: 100,
};

export const Large = Template.bind({});
Large.args = {
  size: 200,
};
