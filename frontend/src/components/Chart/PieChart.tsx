import theme from './theme.json';
import { ResponsivePie } from '@nivo/pie';

interface PieChartProps {
  data: unknown[];
}

function PieChart({ data }: PieChartProps) {
  return (
    <ResponsivePie
      data={data}
      margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
      colors={{ datum: 'data.color' }}
      innerRadius={0.5}
      padAngle={1.5}
      cornerRadius={3}
      sortByValue
      borderWidth={1}
      borderColor={{
        from: 'color',
        modifiers: [['darker', 0.5]],
      }}
      theme={theme}
      enableArcLabels={false}
      arcLinkLabelsThickness={2}
      arcLinkLabelsColor={{ from: 'color' }}
      legends={[
        {
          anchor: 'bottom',
          direction: 'row',
          translateX: 0,
          translateY: 56,
          itemsSpacing: 0,
          itemWidth: 120,
          itemHeight: 18,
          itemDirection: 'left-to-right',
          itemOpacity: 1,
          symbolSize: 18,
          symbolShape: 'circle',
          effects: [
            {
              on: 'hover',
              style: {
                itemTextColor: 'white',
              },
            },
          ],
        },
      ]}
    />
  );
}

export default PieChart;
