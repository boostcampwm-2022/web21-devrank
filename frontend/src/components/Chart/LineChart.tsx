import styled from 'styled-components';
import theme from './theme.json';
import { ResponsiveLine, Serie } from '@nivo/line';

interface LineChartProps {
  data: Serie[];
}

function LineChart({ data }: LineChartProps) {
  return (
    <ResponsiveLine
      theme={theme}
      data={data}
      colors={{ datum: 'color' }}
      margin={{ top: 60, right: 60, bottom: 60, left: 60 }}
      curve='monotoneX'
      enableArea={true}
      xScale={{
        type: 'time',
        format: '%Y-%m-%d',
        useUTC: false,
        precision: 'day',
      }}
      xFormat='time:%Y-%m-%d'
      yScale={{
        type: 'linear',
        stacked: true,
        min: 0,
        max: 'auto',
      }}
      axisBottom={{
        format: '%b',
        tickValues: 'every month',
        legend: 'Date',
        legendOffset: 48,
        legendPosition: 'middle',
      }}
      tooltip={(props) => <Tooltip>{`${props.point.data.y} contribution on ${props.point.data.xFormatted}`}</Tooltip>}
      enablePoints={false}
      useMesh={true}
      enableSlices={false}
      animate={false}
    />
  );
}

export default LineChart;

const Tooltip = styled.div`
  background-color: ${({ theme }) => theme.colors.gray7};
  padding: 10px;
  border-radius: 8px;
`;
