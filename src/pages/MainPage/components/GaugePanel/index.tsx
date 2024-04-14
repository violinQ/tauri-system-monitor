import { Component } from 'solid-js';
import { EChartOption } from 'echarts';
import { ceil, findKey } from 'lodash';

import { useConfigStore, useMonitorStore } from '@/store';
import { getGaugeOption } from './const.ts';
import { useInterval } from '@/hooks/useInterval.ts';
import GaugeChart from './GaugeChart.tsx';

const GaugePanel: Component = () => {
  // 获取刷新间隔
  const refreshInterval = useConfigStore((state) => state.refreshInterval);
  // 获取系统监控数据
  const systemMetrics = useMonitorStore((state) => state.systemMetrics);
  // 更新系统监控数据函数
  const updateSystemMetrics = useMonitorStore(
    (state) => state.updateSystemMetrics,
  );
  // 定时更新系统监控数据
  useInterval(updateSystemMetrics, refreshInterval());
  // 获取系统负载图表配置
  const loadAvgOption = () =>
    getGaugeOption('负载', ceil(systemMetrics.loadAvg || 0, 2), '%');
  // 获取 SOC 温度图表配置
  const socTempOption = () => {
    const sensors = systemMetrics.sensors;
    const key = findKey(sensors, (_, k) => k.toLowerCase().includes('temp'));
    const temp = sensors && key ? sensors[key] : 0;
    return getGaugeOption('温度', temp, '˚C');
  };

  return (
    <>
      <GaugeChart
        id="soc-temp"
        title="SOC温度"
        chartOption={socTempOption() as EChartOption}
      />
      <GaugeChart
        id="load-avg"
        title="系统负载"
        chartOption={loadAvgOption() as EChartOption}
      />
    </>
  );
};

export default GaugePanel;
