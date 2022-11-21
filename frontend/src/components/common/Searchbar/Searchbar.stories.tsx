import { ComponentMeta, ComponentStory } from '@storybook/react';
import Searchbar from '@components/common/Searchbar';

export default {
  title: 'components/Searchbar',
  component: Searchbar,
} as ComponentMeta<typeof Searchbar>;

const Template: ComponentStory<typeof Searchbar> = (args) => <Searchbar {...args} />;

export const Main = Template.bind({});
Main.args = {
  type: 'text',
  placeholder: '유저를 검색해주세요',
  width: 600,
  submitAlign: 'right',
  onChange: (e) => {},
};

export const Short = Template.bind({});
Short.args = {
  type: 'text',
  placeholder: '사용자명',
  width: 200,
  submitAlign: 'left',
  onChange: (e) => {},
};
