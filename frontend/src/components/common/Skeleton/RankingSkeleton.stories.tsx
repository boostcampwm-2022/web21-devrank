import RankingSkeleton from './RankingSkeleton';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'Components/RankingSkeleton',
  component: RankingSkeleton,
} as ComponentMeta<typeof RankingSkeleton>;

const Template: ComponentStory<typeof RankingSkeleton> = () => <RankingSkeleton />;

export const Basic = Template.bind({});
