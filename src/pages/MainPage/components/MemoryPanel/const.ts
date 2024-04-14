import { BarSeriesOption } from 'echarts/charts';
import { EChartOption } from 'echarts';

import { formatByte } from '@/utils.ts';
import { BAR_WIDTH } from '@/const.ts';

/* 内存使用情况图表配置项 */
export const MEMORY_OPTION: EChartOption<BarSeriesOption> = {
  animation: false,
  dataset: {
    source: [['memory', 0, 0]],
  },
  grid: {
    left: 8,
    right: 15,
    bottom: 0,
    top: 0,
    containLabel: true,
  },
  xAxis: {
    max: 18,
    splitLine: {
      show: false,
    },
    axisLabel: {
      show: true,
      formatter: function (value: number) {
        if (value === 0) return '0';
        return formatByte(value, { round: 0 });
      },
    },
    axisLine: { show: false },
    axisTick: { show: false },
    interval: 4,
  },
  yAxis: {
    data: ['memory'],
    splitLine: {
      show: false,
    },
    axisLabel: {
      show: false,
    },
    axisLine: { show: false },
    axisTick: { show: false },
  },
  series: [
    {
      label: {
        show: true,
        formatter: function (params) {
          const value = params.value as [string, number, number];
          const memory = value[1];
          return formatByte(memory, { round: 2, spacer: ' ' });
        },
      },
      name: 'fill',
      type: 'bar',
      barWidth: BAR_WIDTH,
      itemStyle: {
        borderRadius: 2,
      },
      encode: {
        x: 1,
        y: 0,
      },
      z: 3,
    },
    {
      name: 'empty',
      type: 'bar',
      barWidth: BAR_WIDTH,
      stack: 'total',
      barGap: '-100%',
      itemStyle: {
        opacity: 0.3,
        color: '#999',
        borderRadius: [2, 0, 0, 2],
      },
      encode: {
        x: 2,
        y: 0,
      },
    },
  ],
};
