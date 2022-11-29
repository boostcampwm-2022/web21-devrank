import Image from 'next/image';
import styled from 'styled-components';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Button, Dropdown } from '@components/common';

export default {
  title: 'Components/Dropdown',
  component: Dropdown,
} as ComponentMeta<typeof Dropdown>;

const LanguageButton = styled(Button)`
  font-size: ${({ theme }) => theme.fontSize.md};
  background-color: transparent;
  border: 1px solid black;
  height: 58px;
  gap: 4px;
  width: max-content;

  span {
    line-height: 24px;
  }
`;

const Template: ComponentStory<typeof Dropdown> = (args) => (
  <Dropdown {...args}>
    <Dropdown.Trigger>
      <LanguageButton size='md'>
        <Image src='/icons/globe.svg' alt='언어 선택 버튼' width={25} height={25} />
        <span>안녕 난 트리거</span>
      </LanguageButton>
    </Dropdown.Trigger>
    <Dropdown.Item>item1</Dropdown.Item>
    <Dropdown.Item>item2</Dropdown.Item>
    <Dropdown.Item>item3</Dropdown.Item>
  </Dropdown>
);

export const Basic = Template.bind({});
