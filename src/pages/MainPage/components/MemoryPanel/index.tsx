import { Component, createEffect, createSignal } from 'solid-js';
import { EChartOption, ECharts } from 'echarts';

import { useConfigStore, useMonitorStore } from '@/store';
import { useInterval } from '@/hooks/useInterval';
import { MEMORY_OPTION } from './const.ts';
import { Card, EChartsComponent } from '@/components';

const MemoryPanel: Component = () => {
  // 获取全局配置
  const refreshInterval = useConfigStore((state) => state.refreshInterval);
  // 内存信息
  const memoryMetrics = useMonitorStore((state) => state.memoryMetrics);
  // 更新内存信息
  const updateMemoryMetrics = useMonitorStore(
    (state) => state.updateMemoryMetrics,
  );
  // 图表实例
  const [chartInstance, setChartInstance] = createSignal<ECharts>();

  // 定时更新内存信息
  useInterval(updateMemoryMetrics, refreshInterval());

  createEffect(() => {
    // 数据变化时更新图表数据
    const chartIns = chartInstance();
    if (!chartIns) return;
    const usedMemory = memoryMetrics.usedMemory || 0;
    const totalMemory = memoryMetrics.totalMemory || 0;
    chartIns.setOption({
      xAxis: {
        max: totalMemory,
        interval: totalMemory / 4,
      },
      dataset: {
        source: [['memory', usedMemory, totalMemory]],
      },
    });
  });

  return (
    <Card title="">
      <div class="flex items-center text-smaller font-medium">
        <span style={{ width: '35px' }}>内存</span>
        <EChartsComponent
          id="memory-chart"
          option={MEMORY_OPTION as EChartOption}
          onReady={setChartInstance}
          height={41}
          width="100%"
        />
      </div>
    </Card>
  );
};

export default MemoryPanel;
