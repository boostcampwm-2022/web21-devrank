import styled from 'styled-components';
import Ranking from './index';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Avatar } from '@components/common';
import CubeIcon from '@components/common/CubeIcon';

export default {
  title: 'Components/Ranking',
  component: Ranking,
} as ComponentMeta<typeof Ranking>;

const Template: ComponentStory<typeof Ranking> = (args) => <Ranking {...args} />;

const GrayText = styled.span`
  color: ${({ theme }) => theme.colors.gray6};
`;

export const Overall = Template.bind({});
Overall.args = {
  width: 512,
  columnWidthList: ['12%', '8%', '58%', '20%'],
  columnAlignList: ['left', 'left', 'left', 'right'],
  children: (
    <>
      <Ranking.Head>
        <Ranking.Element>티어</Ranking.Element>
        <Ranking.Element>#</Ranking.Element>
        <Ranking.Element>사용자</Ranking.Element>
        <Ranking.Element>점수</Ranking.Element>
      </Ranking.Head>
      <Ranking.Row>
        <Ranking.Element>
          <CubeIcon tier={'red'} />
        </Ranking.Element>
        <Ranking.Element>
          <GrayText>{10}</GrayText>
        </Ranking.Element>
        <Ranking.Element>
          <Avatar src='/profile-dummy.png' name='tunggary' />
        </Ranking.Element>
        <Ranking.Element>
          <GrayText>{(10000).toLocaleString()}</GrayText>
        </Ranking.Element>
      </Ranking.Row>
    </>
  ),
};
