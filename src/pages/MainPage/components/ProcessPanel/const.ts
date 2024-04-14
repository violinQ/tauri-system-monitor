import { BarSeriesOption, PictorialBarSeriesOption } from 'echarts/charts';
import { EChartOption } from 'echarts';

import { formatByte } from '@/utils.ts';
import { BAR_WIDTH } from '@/const.ts';

/* 进程信息图表配置 */
export const PROCESS_OPTION: EChartOption<
  BarSeriesOption | PictorialBarSeriesOption
> = {
  dataset: {
    source: [],
  },
  grid: {
    left: 0,
    right: 65,
    bottom: 0,
    top: 0,
    containLabel: true,
  },
  xAxis: {
    min: 0,
    splitLine: {
      show: false,
    },
    axisLabel: {
      show: false,
      align: 'right',
    },
    axisLine: { show: false },
    axisTick: { show: false },
    type: 'value',
  },
  yAxis: {
    splitLine: {
      show: false,
    },
    axisLabel: {
      show: false,
    },
    axisLine: { show: false },
    axisTick: { show: false },
    type: 'category',
  },
  series: [
    {
      label: {
        show: true,
        formatter: '{@[1]}',
        position: 'insideLeft',
        color: '#000',
      },
      name: 'fill',
      type: 'bar',
      barWidth: BAR_WIDTH,
      itemStyle: {
        opacity: 0.7,
        borderRadius: 4,
      },
      showBackground: true,
      backgroundStyle: {
        borderRadius: 4,
      },
      encode: {
        x: 2,
        y: 0,
      },
      z: 5,
    },
    {
      label: {
        show: true,
        formatter: function (param) {
          const memory = (<number[]>param.value)[2];
          return formatByte(memory, { round: 2 });
        },
        position: 'right',
        opacity: 1,
        color: '#000',
      },
      name: 'fill',
      type: 'pictorialBar',
      symbol: 'rect',
      symbolRepeat: 'fixed',
      itemStyle: {
        opacity: 0,
      },
      encode: {
        x: 2,
        y: 0,
      },
      z: 5,
    },
  ],
};
