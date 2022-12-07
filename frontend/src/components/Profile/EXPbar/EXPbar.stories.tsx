import { ComponentMeta, ComponentStory } from '@storybook/react';
import EXPbar from '@components/Profile/EXPbar';

export default {
  title: 'Components/EXPbar',
  component: EXPbar,
} as ComponentMeta<typeof EXPbar>;

const Template: ComponentStory<typeof EXPbar> = (args) => <EXPbar {...args} />;

export const Yellow = Template.bind({});
Yellow.args = {
  tier: 'yellow',
  exp: 99,
  needExp: 1,
  startExp: 0,
};

export const Green = Template.bind({});
Green.args = {
  tier: 'green',
  exp: 101,
  needExp: 98,
  startExp: 100,
};

export const Mint = Template.bind({});
Mint.args = {
  tier: 'mint',
  exp: 250,
  needExp: 249,
  startExp: 200,
};

export const Blue = Template.bind({});
Blue.args = {
  tier: 'blue',
  exp: 999,
  needExp: 1,
  startExp: 500,
};

export const Purple = Template.bind({});
Purple.args = {
  tier: 'purple',
  exp: 1500,
  needExp: 499,
  startExp: 1000,
};

export const Orange = Template.bind({});
Orange.args = {
  tier: 'orange',
  exp: 2001,
  needExp: 2998,
  startExp: 2000,
};

export const Red = Template.bind({});
Red.args = {
  tier: 'red',
  exp: 6000,
  needExp: 0,
  startExp: 5000,
};
