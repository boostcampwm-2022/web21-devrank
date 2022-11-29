import ProfileLabel from '.';
import { ComponentMeta, ComponentStory } from '@storybook/react';

export default {
  title: 'Components/ProfileLabel',
  component: ProfileLabel,
} as ComponentMeta<typeof ProfileLabel>;

const LocationTemplate: ComponentStory<typeof ProfileLabel> = (args) => (
  <ProfileLabel {...args}>
    <ProfileLabel.Icon src='/icons/location.svg' />
    <ProfileLabel.Contents>Daegu, Gwangyeoksi</ProfileLabel.Contents>
  </ProfileLabel>
);

export const LocationLabel = LocationTemplate.bind({});
