import { Component, createEffect, createSignal } from 'solid-js';
import { EChartOption, ECharts } from 'echarts';
import { get, round } from 'lodash';

import { useInterval } from '@/hooks/useInterval';
import { useConfigStore, useMonitorStore } from '@/store';
import { BATTERY_OPTION, BatteryState, BatteryStateText } from './const';
import { Card, EChartsComponent } from '@/components';
import './index.css';

const BatteryPanel: Component = () => {
  // 获取全局配置
  const refreshInterval = useConfigStore((state) => state.refreshInterval);
  // 电源信息
  const batteryMetrics = useMonitorStore((state) => state.batteryMetrics);
  // 更新电源信息
  const updateBatteryMetrics = useMonitorStore(
    (state) => state.updateBatteryMetrics,
  );
  // 图表实例
  const [chartInstance, setChartInstance] = createSignal<ECharts>();

  // 定时更新电源信息
  useInterval(updateBatteryMetrics, refreshInterval());

  createEffect(() => {
    const chartIns = chartInstance();
    if (!chartIns) return;
    // 数据更新时更新图表数据
    chartIns.setOption({
      dataset: {
        source: [
          [
            'battery',
            get(batteryMetrics, 'percentage', 0),
            100,
            batteryMetrics.state === BatteryState.Charging,
          ],
        ],
      },
    });
  });

  return (
    <Card
      title={
        <>
          <span>电量</span>
          <div class="flex gap-1">
            <EChartsComponent
              id="battery-chart"
              option={BATTERY_OPTION as EChartOption}
              onReady={setChartInstance}
              height={24}
              width="60%"
            />
            <span>{round(get(batteryMetrics, 'percentage', 0), 0)}%</span>
          </div>
        </>
      }
    >
      <table class="battery-info">
        <tbody>
          <tr>
            <td class="label">状态</td>
            <td>
              <span>
                {BatteryStateText[batteryMetrics.state as BatteryState]}
              </span>
            </td>
            <td class="label">电源温度</td>
            <td>{round(get(batteryMetrics, 'temperature', 0), 1)}ºC</td>
          </tr>
        </tbody>
      </table>
    </Card>
  );
};

export default BatteryPanel;
