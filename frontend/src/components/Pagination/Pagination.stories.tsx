import Pagination from '.';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'Components/Pagination',
  component: Pagination,
} as ComponentMeta<typeof Pagination>;

const Template: ComponentStory<typeof Pagination> = (args) => <Pagination {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  currentPage: 1,
  range: {
    left: 1,
    right: 4,
  },
  firstPage: 1,
  lastPage: 4,
  canMoveLeft: false,
  canMoveRight: false,
};
