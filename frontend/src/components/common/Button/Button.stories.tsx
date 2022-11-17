import { ComponentMeta, ComponentStory } from '@storybook/react';
import Button from '@components/common/Button';

export default {
  title: 'Components/Button',
  component: Button,
} as ComponentMeta<typeof Button>;

const Template: ComponentStory<typeof Button> = (args) => <Button {...args} />;

export const Small = Template.bind({});
Small.args = {
  size: 'sm',
  children: '버튼',
};

export const Medium = Template.bind({});
Medium.args = {
  size: 'md',
  children: '버튼',
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  children: '버튼',
};
