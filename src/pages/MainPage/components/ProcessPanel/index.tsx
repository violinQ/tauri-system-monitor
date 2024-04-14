import { Component, createEffect, createSignal, Show } from 'solid-js';
import { EChartOption, ECharts } from 'echarts';

import { useConfigStore, useMonitorStore } from '@/store';
import { useInterval } from '@/hooks/useInterval';
import { PROCESS_OPTION } from './const.ts';
import { Card, EChartsComponent, Spin } from '@/components';

const ProcessPanel: Component = () => {
  // 获取全局配置
  const refreshInterval = useConfigStore((state) => state.refreshInterval);
  // 获取系统进程监控数据
  const processMetrics = useMonitorStore((state) => state.processMetrics);
  // 更新系统进程监控数据函数
  const updateProcessMetrics = useMonitorStore(
    (state) => state.updateProcessMetrics,
  );
  // 图表实例
  const [echartsIns, setEchartsIns] = createSignal<ECharts>();

  useInterval(updateProcessMetrics, refreshInterval());

  createEffect(() => {
    const chartIns = echartsIns();
    if (!chartIns || processMetrics.length === 0) return;
    // 更新图表数据
    const top10Process = processMetrics.slice(0, 10).reverse();
    const source = top10Process.reduce((acc: string[][], process) => {
      acc.push([process.pid, process.name, String(process.memory)]);
      return acc;
    }, []);
    chartIns.setOption({
      dataset: [{ source }],
    });
  });

  return (
    <Card title="">
      <Show
        when={processMetrics.length > 0}
        fallback={
          <div class="relative grid w-full h-[250px] place-items-center">
            <Spin />
          </div>
        }
      >
        <EChartsComponent
          id="process-chart"
          onReady={(ins) => setEchartsIns(ins)}
          option={PROCESS_OPTION as EChartOption}
          height={250}
          width="100%"
        />
      </Show>
    </Card>
  );
};

export default ProcessPanel;
