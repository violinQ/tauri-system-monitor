import { EChartOption } from 'echarts';
import { GaugeSeriesOption } from 'echarts/charts';

/* 仪表盘图表配置项 */
export const GAUGE_OPTION: EChartOption<GaugeSeriesOption> = {
  series: [
    {
      name: 'usage',
      type: 'gauge',
      radius: '95%',
      progress: {
        show: true,
        roundCap: true,
        width: 8,
      },
      itemStyle: {
        color: '#58D9F9',
        shadowColor: 'rgba(0,138,255,0.45)',
        shadowBlur: 10,
        shadowOffsetX: 2,
        shadowOffsetY: 2,
      },
      axisLabel: {
        show: false,
      },
      pointer: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      axisLine: {
        lineStyle: {
          width: 8,
          color: [[1, '#666']],
        },
        roundCap: true,
      },
      anchor: {
        show: false,
      },
      detail: {
        valueAnimation: true,
        fontSize: 20,
        color: 'inherit',
        offsetCenter: ['0%', '0%'],
      },
      data: [
        {
          value: 0,
        },
      ],
    },
  ],
};

/* 根据传入的参数返回可绘制对应硬件的仪表盘图表配置项 */
export const getGaugeOption = <V extends number | '-'>(
  name: string,
  value: V,
  unit: string,
): EChartOption<GaugeSeriesOption> => ({
  series: [
    {
      data: [
        {
          title: {
            show: true,
            fontSize: 10,
            color: '#808080',
            offsetCenter: ['0%', '60%'],
          },
          name: name,
          value: value,
        },
      ],
      detail: {
        formatter: `{value}${unit}`,
      },
    },
  ],
});
