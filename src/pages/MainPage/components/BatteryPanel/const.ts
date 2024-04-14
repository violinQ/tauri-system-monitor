import { BarSeriesOption, PictorialBarSeriesOption } from 'echarts/charts';
import * as echarts from 'echarts';
import { ceil } from 'lodash';

import { BAR_WIDTH } from '@/const.ts';

/* 电源状态枚举 */
export const enum BatteryState {
  Full = 1,
  Charging = 2,
  Discharging = 3,
  Empty = 0,
  Unknown = -1,
}

/* 电源状态显示的对应文本 */
export const BatteryStateText: Record<BatteryState, string> = {
  [BatteryState.Full]: '已充满',
  [BatteryState.Charging]: '充电中',
  [BatteryState.Discharging]: '放电中',
  [BatteryState.Empty]: '电量用尽',
  [BatteryState.Unknown]: '未知',
};

const { LinearGradient } = echarts.graphic;

/* 根据电量百分比获取对应颜色 */
function getColorByPercentage(percentage: number, isCharge: boolean) {
  if (isCharge || percentage >= 80) {
    return '#0a915d';
  }
  if (percentage > 20) {
    return '#faad14';
  }
  return '#f5222d';
}

/* 获取渐变填充 */
function getFillLinear(color: string) {
  return new LinearGradient(
    0,
    0,
    1,
    0,
    [
      { offset: 0, color: `${color}aa` },
      { offset: 1, color: color },
    ],
    false,
  );
}

/* 电量信息图表配置项 */
export const BATTERY_OPTION: echarts.EChartOption<
  BarSeriesOption | PictorialBarSeriesOption
> = {
  animation: false,
  dataset: {
    source: [['battery', 0, 100]],
  },
  grid: {
    left: 13,
    right: 13,
    bottom: 0,
    top: 0,
    containLabel: true,
  },
  xAxis: [
    {
      splitLine: {
        show: false,
      },
      axisLabel: {
        show: false,
      },
      axisLine: { show: false },
      axisTick: { show: false },
    },
  ],
  yAxis: {
    data: ['battery'],
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
      name: 'fill',
      type: 'bar',
      barWidth: BAR_WIDTH,
      itemStyle: {
        color: function (params) {
          const value = params.value as [string, number, number, boolean];
          const percentage = ceil(value[1], 0);
          const isCharge = value[3];
          const color = getColorByPercentage(percentage, isCharge);
          return getFillLinear(color);
        },
        borderRadius: 4,
      },
      encode: {
        x: 1,
        y: 0,
      },
    },
    {
      name: 'fill',
      type: 'bar',
      barWidth: BAR_WIDTH,
      barGap: '-100%',
      itemStyle: {
        color: 'none',
        borderColor: '#000',
        borderRadius: 4,
      },
      encode: {
        x: 2,
        y: 0,
      },
      z: 5,
    },
    {
      type: 'pictorialBar',
      symbol: 'roundRect',
      symbolSize: [2, BAR_WIDTH / 2],
      symbolOffset: [4, 0],
      symbolPosition: 'end',
      itemStyle: {
        color: '#000',
      },
      data: [100],
      z: 10,
    },
  ],
};
