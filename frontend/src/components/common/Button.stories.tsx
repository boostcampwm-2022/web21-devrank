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
  label: '버튼',
};

export const Medium = Template.bind({});
Medium.args = {
  size: 'md',
  label: '버튼',
};

export const Disabled = Template.bind({});
Disabled.args = {
  disabled: true,
  label: '버튼',
};
