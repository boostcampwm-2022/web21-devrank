import LanguageIcon from './index';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'Components/LanguageIcon',
  component: LanguageIcon,
} as ComponentMeta<typeof LanguageIcon>;

const Template: ComponentStory<typeof LanguageIcon> = (args) => <LanguageIcon {...args} />;

export const Javascript = Template.bind({});
Javascript.args = {
  language: 'javascript',
};

export const Typescript = Template.bind({});
Typescript.args = {
  language: 'typescript',
};

export const Rust = Template.bind({});
Rust.args = {
  language: 'rust',
};
