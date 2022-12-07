import styled from 'styled-components';
import RankingTable from './index';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Avatar } from '@components/common';
import CubeIcon from '@components/common/CubeIcon';

export default {
  title: 'Components/Ranking',
  component: RankingTable,
  subcomponents: { Avatar, CubeIcon },
} as ComponentMeta<typeof RankingTable>;

const GrayText = styled.span`
  color: ${({ theme }) => theme.colors.gray5};
`;

const OverallTemplate: ComponentStory<typeof RankingTable> = (args) => (
  <RankingTable {...args}>
    <RankingTable.Head>
      <RankingTable.Element>티어</RankingTable.Element>
      <RankingTable.Element>#</RankingTable.Element>
      <RankingTable.Element>사용자</RankingTable.Element>
      <RankingTable.Element>점수</RankingTable.Element>
    </RankingTable.Head>
    <RankingTable.Row>
      <RankingTable.Element>
        <CubeIcon tier={'red'} />
      </RankingTable.Element>
      <RankingTable.Element>
        <GrayText>{10}</GrayText>
      </RankingTable.Element>
      <RankingTable.Element>
        <Avatar src='/profile-dummy.png' name='tunggary' />
      </RankingTable.Element>
      <RankingTable.Element>
        <GrayText>{(10000).toLocaleString()}</GrayText>
      </RankingTable.Element>
    </RankingTable.Row>
  </RankingTable>
);

export const Overall = OverallTemplate.bind({});
Overall.args = {
  width: '512px',
  columnWidthList: ['12%', '8%', '58%', '20%'],
  columnAlignList: ['left', 'left', 'left', 'right'],
};
