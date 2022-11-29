import { ComponentMeta, ComponentStory } from '@storybook/react';
import EXPbar from '@components/Profile/EXPbar';

export default {
  title: 'Components/EXPbar',
  component: EXPbar,
  argTypes: {
    exp: {
      control: {
        type: 'range',
        min: 0,
        max: 699,
      },
    },
  },
} as ComponentMeta<typeof EXPbar>;

const Template: ComponentStory<typeof EXPbar> = (args) => <EXPbar {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  exp: 90,
};
