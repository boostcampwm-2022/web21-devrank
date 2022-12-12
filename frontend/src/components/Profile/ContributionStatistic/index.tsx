import dynamic from 'next/dynamic';
import styled, { useTheme } from 'styled-components';
import { RANK } from '@type/common';
import { ProfileUserResponse } from '@type/response';
import { TIER_OFFSET } from '@utils/constants';
import {
  getLineChartMinMaxValue,
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
  const theme = useTheme();
  const pieChartData = transToPieChartData(data.history);
  const contributionHistoryData = transContributionHistoryToLineChartData(data.history.contributionHistory, data.tier);
  const scoreHistoryData = transScoreHistoryToLineChartData(data.scoreHistory, data.tier);
  const { min, max } = getLineChartMinMaxValue(scoreHistoryData);

  return (
    <ChartContainer>
      <Chart>
        <ChartTitle>Contribution Statistics</ChartTitle>
        <PieChart data={pieChartData} />
      </Chart>
      <Chart>
        <ChartTitle>Contribution History</ChartTitle>
        <LineChart data={contributionHistoryData} />
      </Chart>
      <Chart>
        <ChartTitle>Score History</ChartTitle>
        <LineChart
          data={scoreHistoryData}
          min={min}
          max={max}
          markers={Object.entries(TIER_OFFSET).map(([tier, score]) => ({
            axis: 'y',
            value: score,
            lineStyle: { stroke: theme.colors[`${tier as RANK}2`], strokeWidth: 1, strokeDasharray: '4 4' },
            legend: tier,
            legendPosition: 'right',
            textStyle: { fill: theme.colors[`${tier as RANK}2`], fontSize: 10, fontWeight: 'bold' },
          }))}
        />
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
