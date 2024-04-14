import { Component, onCleanup, onMount } from 'solid-js';
import { listen, TauriEvent } from '@tauri-apps/api/event';
import { appWindow } from '@tauri-apps/api/window';
import { invoke } from '@tauri-apps/api/tauri';

import { Commands } from '@/store/monitor';
import { useInterval } from '@/hooks/useInterval';
import MainPage from '@/pages/MainPage';

const App: Component = () => {
  // 窗口监听函数返回的取消监听函数
  let unListenFn: () => void;

  useInterval(async () => {
    await invoke(Commands.TRAY);
  }, 5000);

  onMount(async () => {
    // 监听窗口失焦事件
    unListenFn = await listen(TauriEvent.WINDOW_BLUR, async (event) => {
      // 主窗口失去焦点时隐藏窗口
      if (event.windowLabel === 'main') {
        await appWindow.hide();
      }
    });
  });

  onCleanup(() => {
    // 组件卸载时取消监听窗口失焦事件
    unListenFn();
  });

  return (
    <section class="container">
      <main class="main">
        <MainPage />
      </main>
    </section>
  );
};

export default App;
