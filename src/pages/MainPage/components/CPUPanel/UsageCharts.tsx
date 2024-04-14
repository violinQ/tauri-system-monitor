import { Component, createEffect, createSignal, splitProps } from 'solid-js';
import { EChartOption, ECharts } from 'echarts';
import { merge } from 'lodash';

import { CPU_OPTION } from './const';
import { EChartsComponent } from '@/components';

interface UsageChartsProps {
  /* 图表id */
  id?: string;
  /* 图表class */
  class?: string;
  /* 图表的配置对象 */
  option?: EChartOption;
  /* 使用率数据 */
  data: number;
  /* 图表高度 */
  height: string | number;
  /* 图表宽度 */
  width: string | number;
  /* 最大数据长度，超过这个长度时每次更新数据会将当前第一份数据删除，保证性能 默认: 20 */
  maxSize?: number;
}

const UsageCharts: Component<UsageChartsProps> = (props) => {
  const [local, rest] = splitProps(props, ['option', 'data', 'maxSize']);
  // 获取图表实例
  const [chartInstance, setChartInstance] = createSignal<ECharts>();

  createEffect(() => {
    // 数据更新时更新图表数据
    const chartIns = chartInstance();
    if (!chartIns) return;
    const option = chartIns.getOption();
    const date = new Date().getTime();
    const data = local.data;
    // 如果数据长度超过设定的长度，删除首位数据
    if (option.series![0].data?.length > (local.maxSize || 20)) {
      option.series![0].data?.shift();
    }
    // 更新图表数据
    option.series![0].data?.push([date, data]);
    chartIns.setOption(option);
  });

  return (
    <EChartsComponent
      option={merge({}, CPU_OPTION, local.option)}
      onReady={setChartInstance}
      {...rest}
    />
  );
};

export default UsageCharts;
