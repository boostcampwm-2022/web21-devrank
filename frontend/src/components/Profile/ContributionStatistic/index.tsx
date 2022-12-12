import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { ProfileUserResponse } from '@type/response';
import {
  transContributionHistoryToLineChartData,
  transScoreHistoryToLineChartData,
  transToPieChartData,
} from '@utils/utils';

const PieChart = dynamic(() => import('@components/Chart/PieChart'), { ssr: false });
const LineChart = dynamic(() => import('@components/Chart/LineChart'), { ssr: false });

interface ContributionStatisticProps {
  data: ProfileUserResponse;
}

function ContributionStatistic({ data }: ContributionStatisticProps) {
  return (
    <ChartContainer>
      <Chart>
        <ChartTitle>Contribution Statistics</ChartTitle>
        <PieChart data={transToPieChartData(data.history)} />
      </Chart>
      <Chart>
        <ChartTitle>Contribution History</ChartTitle>
        <LineChart data={transContributionHistoryToLineChartData(data.history.contributionHistory, data.tier)} />
      </Chart>
      <Chart>
        <ChartTitle>Score History</ChartTitle>
        <LineChart data={transScoreHistoryToLineChartData(data.scoreHistory, data.tier)} />
      </Chart>
    </ChartContainer>
  );
}

export default ContributionStatistic;

const ChartContainer = styled.ul`
  ${({ theme }) => theme.common.flexCenterColumn};
  width: 100%;

  li + li {
    margin-top: 50px;
  }
`;

const Chart = styled.li`
  width: 100%;
  height: 400px;
`;

const ChartTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSize.lg};
  font-weight: ${({ theme }) => theme.fontWeight.bold};
`;
