import CubeIcon from './index';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { CUBE_RANK } from '@utils/constants';

export default {
  title: 'Components/CubeIcon',
  component: CubeIcon,
} as ComponentMeta<typeof CubeIcon>;

const Template: ComponentStory<typeof CubeIcon> = (args) => <CubeIcon {...args} />;

export const All = Template.bind({});
All.args = {
  tier: CUBE_RANK.ALL,
};

export const Yellow = Template.bind({});
Yellow.args = {
  tier: CUBE_RANK.YELLOW,
};

export const Green = Template.bind({});
Green.args = {
  tier: CUBE_RANK.GREEN,
};

export const Mint = Template.bind({});
Mint.args = {
  tier: CUBE_RANK.MINT,
};

export const Blue = Template.bind({});
Blue.args = {
  tier: CUBE_RANK.BLUE,
};

export const Purple = Template.bind({});
Purple.args = {
  tier: CUBE_RANK.PURPLE,
};

export const Orange = Template.bind({});
Orange.args = {
  tier: CUBE_RANK.ORANGE,
};

export const Red = Template.bind({});
Red.args = {
  tier: CUBE_RANK.RED,
};
