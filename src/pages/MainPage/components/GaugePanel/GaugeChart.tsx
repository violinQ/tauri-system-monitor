import { Component, createEffect, createSignal } from 'solid-js';
import { EChartOption, ECharts } from 'echarts';

import { GAUGE_OPTION } from './const.ts';
import { Card, EChartsComponent } from '@/components';

interface GaugeChartProps {
  id?: string;
  /* 标题 */
  title: string;
  /* 图表配置 */
  chartOption: EChartOption;
}

const GaugeChart: Component<GaugeChartProps> = (props) => {
  // 图表实例
  const [echartsIns, setEchartsIns] = createSignal<ECharts>();

  createEffect(() => {
    const chartIns = echartsIns();
    if (!chartIns) return;
    chartIns.setOption(props.chartOption);
  });

  return (
    <Card title={props.title}>
      <EChartsComponent
        id={props.id}
        onReady={(ins) => setEchartsIns(ins)}
        option={GAUGE_OPTION as EChartOption}
        height={100}
        width="100%"
      />
    </Card>
  );
};

export default GaugeChart;
