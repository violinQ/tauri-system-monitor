import { createWithStore } from 'solid-zustand';
import { invoke } from '@tauri-apps/api/tauri';

export const enum Commands {
  CPU = 'get_cpu_metrics',
  MEMORY = 'get_memory_metrics',
  BATTERY = 'get_battery_metrics',
  PROCESS = 'get_process_metrics',
  SYSTEM = 'get_system_metrics',
  TRAY = 'update_tray_title',
}

interface State {
  /* CPU 监控数据 */
  cpuMetrics: Partial<CPU>;
  /* 电池监控数据 */
  batteryMetrics: Partial<Battery>;
  /* 内存监控数据 */
  memoryMetrics: Partial<Memory>;
  /* 系统监控数据 */
  systemMetrics: Partial<System>;
  /* 进程监控数据 */
  processMetrics: Array<Process>;
}

interface Actions {
  /* 更新系统监控数据 */
  updateSystemMetrics: () => void;
  /* 更新电池监控数据 */
  updateBatteryMetrics: () => void;
  /* 更新内存监控数据 */
  updateMemoryMetrics: () => void;
  /* 更新 CPU 监控数据 */
  updateCPUMetrics: () => void;
  /* 更新进程监控数据 */
  updateProcessMetrics: () => void;
}

/* 硬件信息 */
export const useMonitorStore = createWithStore<State & Actions>((set) => ({
  cpuMetrics: {},
  batteryMetrics: {},
  memoryMetrics: {},
  systemMetrics: {},
  processMetrics: [],

  updateCPUMetrics: async () => {
    try {
      const data = await invoke<CPU>(Commands.CPU);
      set({ cpuMetrics: data });
    } catch (err) {
      console.error('更新 CPU 监控数据失败', err);
    }
  },

  updateBatteryMetrics: async () => {
    try {
      const data = await invoke<Battery>(Commands.BATTERY);
      set({ batteryMetrics: data });
    } catch (err) {
      console.error('更新电池监控数据失败', err);
    }
  },

  updateMemoryMetrics: async () => {
    try {
      const data = await invoke<Memory>(Commands.MEMORY);
      set({ memoryMetrics: data });
    } catch (err) {
      console.error('更新内存监控数据失败', err);
    }
  },

  updateSystemMetrics: async () => {
    try {
      const data = await invoke<System>(Commands.SYSTEM);
      set({ systemMetrics: data });
    } catch (err) {
      console.error('更新系统监控数据失败', err);
    }
  },

  updateProcessMetrics: async () => {
    try {
      const data = await invoke<Process[]>(Commands.PROCESS);
      set({ processMetrics: data });
    } catch (err) {
      console.error('更新进程监控数据失败', err);
    }
  },
}));
