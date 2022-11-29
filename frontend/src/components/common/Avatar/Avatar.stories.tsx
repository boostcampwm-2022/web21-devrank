import Avatar from './index';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'Components/Avatar',
  component: Avatar,
} as ComponentMeta<typeof Avatar>;

const Template: ComponentStory<typeof Avatar> = (args) => <Avatar {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  src: '/profile-dummy.png',
};

export const Small = Template.bind({});
Small.args = {
  src: '/profile-dummy.png',
  size: 'sm',
};

export const Medium = Template.bind({});
Medium.args = {
  src: '/profile-dummy.png',
  size: 'md',
};

export const Large = Template.bind({});
Large.args = {
  src: '/profile-dummy.png',
  size: 'lg',
};

export const ProfileWithName = Template.bind({});
ProfileWithName.args = {
  src: '/profile-dummy.png',
  size: 'md',
  name: 'nickname',
};
