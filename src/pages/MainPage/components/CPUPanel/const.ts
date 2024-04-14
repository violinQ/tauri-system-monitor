import { LineSeriesOption } from 'echarts/charts';
import type { EChartOption } from 'echarts';
import { round } from 'lodash';

type SplitLine = EChartOption.BasicComponents.CartesianAxis.SplitLine;

const normalSplitLine: SplitLine = {
  show: true,
  lineStyle: {
    color: '#4C4D4F',
    opacity: 0.5,
  },
};

/* CPU占用率图表配置项 */
export const CPU_OPTION: EChartOption<LineSeriesOption> = {
  animation: false,
  grid: {
    left: '5',
    right: '5',
    bottom: '5',
    top: '5',
    containLabel: true,
  },
  xAxis: [
    {
      type: 'time',
      splitLine: normalSplitLine,
      axisLabel: {
        show: false,
      },
      axisPointer: {
        show: false,
      },
      axisTick: {
        show: false,
      },
    },
  ],
  yAxis: {
    type: 'value',
    min: 0,
    max: 100,
    splitLine: normalSplitLine,
    axisLabel: {
      show: false,
    },
    axisTick: {
      show: false,
    },
    axisPointer: {
      value: 0,
      snap: true,
      show: false,
      label: {
        formatter: function (params: { value: number }): string {
          return params.value.toFixed(0) + '%';
        },
      },
    },
  },
  series: [
    {
      name: 'usage',
      type: 'line',
      areaStyle: {},
      showSymbol: false,
      data: [],
      markLine: {
        symbol: 'none',
        label: {
          formatter: function (params): string {
            return `${round(params.value as number, 0)}%`;
          },
          position: 'insideEnd',
        },
        lineStyle: {
          color: '#1677ff',
        },
        data: [
          {
            type: 'max',
          },
        ],
      },
    },
  ],
};
