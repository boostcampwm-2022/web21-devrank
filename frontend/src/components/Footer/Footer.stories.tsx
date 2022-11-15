import { ComponentMeta, ComponentStory } from '@storybook/react';
import Footer from '@components/Footer';

export default {
  title: 'Components/Footer',
  component: Footer,
} as ComponentMeta<typeof Footer>;

const Template: ComponentStory<typeof Footer> = () => <Footer />;

export const Basic = Template.bind({});
