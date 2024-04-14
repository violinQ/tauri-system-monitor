import { createWithSignal } from 'solid-zustand';

interface ConfigStore {
  /* 更新监控数据的间隔 单位:ms */
  refreshInterval: number;
  /* App主题 */
  theme: 'light' | 'dark';
}

interface ConfigActions {
  /* 更新监控数据的间隔 单位:ms */
  setRefreshInterval: (refreshInterval: number) => void;
  /* App主题 */
  setTheme: (theme: 'light' | 'dark') => void;
}

/**
 * 全局配置
 */
export const useConfigStore = createWithSignal<ConfigStore & ConfigActions>(
  (set) => ({
    refreshInterval: 3000,
    theme: 'light',

    setRefreshInterval: (refreshInterval: number) => set({ refreshInterval }),
    setTheme: (theme: 'light' | 'dark') => set({ theme }),
  }),
);
