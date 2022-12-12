import theme from '../theme.json';
import { CartesianMarkerProps } from '@nivo/core';
import { DatumValue, PointTooltip, ResponsiveLine, Serie } from '@nivo/line';

interface LineChartProps {
  data: Serie[];
  min?: number;
  max?: number;
  markers?: CartesianMarkerProps<DatumValue>[];
  tooltip?: PointTooltip;
}

function LineChart({ data, min, max, markers, tooltip }: LineChartProps) {
  return (
    <>
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
          min: min || 0,
          max: max || 'auto',
        }}
        axisBottom={{
          format: '%b',
          tickValues: 'every month',
          legend: 'Date',
          legendOffset: 48,
          legendPosition: 'middle',
        }}
        tooltip={tooltip}
        enablePoints={false}
        useMesh={true}
        enableSlices={false}
        markers={markers}
      />
    </>
  );
}

export default LineChart;
