import { onCleanup, onMount } from 'solid-js';

/**
 * 定时器 hook
 * @param callback 回调函数
 * @param delay 间隔时间
 */
export function useInterval(callback: () => void, delay: number): void {
  let intervalId: number;

  onMount(() => {
    intervalId = setInterval(callback, delay);
  });

  onCleanup(() => clearInterval(intervalId));
}
