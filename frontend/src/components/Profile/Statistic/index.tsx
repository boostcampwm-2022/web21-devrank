import dynamic from 'next/dynamic';
import styled, { useTheme } from 'styled-components';
import { HistoryType, RANK, ScoreHistory } from '@type/common';
import { Tooltip } from '@components/Chart';
import { TIER_OFFSET } from '@utils/constants';
import {
  getLineChartMinMaxValue,
  transScoreHistoryToLineChartData,
  useTransContributionHistoryToLineChartData,
  useTransToPieChartData,
} from '@utils/utils';

const PieChart = dynamic(() => import('@components/Chart/PieChart'), { ssr: false });
const LineChart = dynamic(() => import('@components/Chart/LineChart'), { ssr: false });

interface ContributionStatisticProps {
  history: HistoryType;
  scoreHistory: ScoreHistory[];
  tier: RANK;
}

function Statistic({ history, scoreHistory, tier }: ContributionStatisticProps) {
  const theme = useTheme();
  const scoreHistoryData = transScoreHistoryToLineChartData(scoreHistory, tier);
  const pieChartData = useTransToPieChartData(history);
  const contributionHistoryData = useTransContributionHistoryToLineChartData(history.contributionHistory, tier);
  const { min, max } = getLineChartMinMaxValue(scoreHistoryData);

  return (
    <ChartContainer>
      <Chart>
        <ChartTitle>Contribution Statistics</ChartTitle>
        <PieChart data={pieChartData} />
      </Chart>
      <Chart>
        <ChartTitle>Contribution History</ChartTitle>
        <LineChart
          data={contributionHistoryData}
          tooltip={(props) => (
            <Tooltip>{`${props.point.data.y} contribution on ${props.point.data.xFormatted}`}</Tooltip>
          )}
        />
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
            textStyle: { fill: theme.colors[`${tier as RANK}2`], fontSize: 12, fontWeight: 'bold' },
          }))}
          tooltip={(props) => <Tooltip>{`${props.point.data.y} scores on ${props.point.data.xFormatted}`}</Tooltip>}
        />
      </Chart>
    </ChartContainer>
  );
}

export default Statistic;

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
