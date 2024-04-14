import { Component, createMemo, Index } from 'solid-js';

import { useConfigStore, useMonitorStore } from '@/store';
import { useInterval } from '@/hooks/useInterval';
import { Card, Spin } from '@/components';
import UsageCharts from './UsageCharts.tsx';

// 计算图表组的行数和列数
function calculateRowsAndCols(coresNum: number) {
  if (coresNum === 1) return { rows: 1, cols: 1 };
  let cols: number;
  if (coresNum <= 4) {
    cols = 2;
  } else if (coresNum % 3 === 0) {
    cols = 3;
  } else {
    cols = 4;
  }
  const rows = Math.ceil(coresNum / cols);
  return { rows, cols };
}

const CPUPanel: Component = () => {
  // 获取全局配置
  const refreshInterval = useConfigStore((state) => state.refreshInterval);
  // cpu性能信息
  const cpuMetrics = useMonitorStore((state) => state.cpuMetrics);
  // 更新cpu性能信息
  const updateCPUMetrics = useMonitorStore((state) => state.updateCPUMetrics);
  // cpu各个核心信息
  const coresInfo = () => cpuMetrics.cores || [];
  // cpu型号信息
  const chipName = createMemo(() => cpuMetrics.chipName || '');
  // 图表的行数和列数
  const rowsAndCols = createMemo(() =>
    calculateRowsAndCols(coresInfo().length),
  );

  // 定时更新cpu性能信息
  useInterval(updateCPUMetrics, refreshInterval());

  // 面板标题
  const Title = (
    <>
      <span>CPU核心负载</span>
      <span>{chipName()}</span>
      <UsageCharts
        id="total-usage"
        option={{ series: [{ type: 'bar' }] }}
        data={cpuMetrics.globalUsage || 0}
        height="24px"
        width="100px"
        maxSize={10}
      />
    </>
  );

  return (
    <Card title={Title}>
      <div
        id="all-core-usage"
        class="relative grid min-h-[200px] place-items-center"
        style={{
          ['grid-template-rows']: `repeat(${rowsAndCols().rows}, minmax(0, 1fr))`,
          ['grid-template-columns']: `repeat(${rowsAndCols().cols}, minmax(0, 1fr))`,
        }}
      >
        <Index each={coresInfo()} fallback={<Spin />}>
          {(core, index) => (
            <UsageCharts
              class={`core-${index}`}
              option={{
                title: {
                  text: `core-${index}`,
                  textStyle: { fontSize: 12 },
                  textAlign: 'left',
                },
              }}
              data={core().usage}
              height="100%"
              width="100%"
              maxSize={20}
            />
          )}
        </Index>
      </div>
    </Card>
  );
};

export default CPUPanel;
