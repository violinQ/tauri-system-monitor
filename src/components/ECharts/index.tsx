import {
  Component,
  createRoot,
  JSX,
  onCleanup,
  onMount,
  splitProps,
} from 'solid-js';
import * as echarts from 'echarts';
import { EChartOption, ECharts } from 'echarts';
import { isNumber } from 'lodash';

interface ChartProps
  extends Pick<
    JSX.HTMLAttributes<HTMLDivElement>,
    'id' | 'class' | 'classList'
  > {
  /* 图表加载完成后的回调 */
  onReady?: (chartInstance: ECharts) => void;
  /* 图表配置项 */
  option: EChartOption;
  /* 图表容器样式 */
  style?: JSX.CSSProperties;
  /* 图表容器高度 传入数字时默认单位为 px */
  height: string | number;
  /* 图表容器宽度 传入数字时默认单位为 px */
  width: string | number;
}

const EChartsComponent: Component<ChartProps> = (chartProps) => {
  const [props, attr] = splitProps(chartProps, [
    'height',
    'width',
    'onReady',
    'option',
  ]);
  // 图表容器
  let chartRef: HTMLDivElement;
  // 图表实例
  let echartsInstance: ECharts;

  const init = (element: HTMLDivElement) => {
    createRoot(() => {
      // 设置图表元素的高度和宽度
      const height = isNumber(props.height)
        ? `${props.height}px`
        : props.height;
      const width = isNumber(props.width) ? `${props.width}px` : props.width;
      element.setAttribute('style', `height: ${height}; width: ${width};`);
      // 将图表容器赋值给 chartRef
      chartRef = element;
    });
  };

  onMount(() => {
    echartsInstance = echarts.init(chartRef);
    // 初始化图表实例
    echartsInstance.setOption(props.option);
    // 如果父组件传入了 onReady 回调，则在图表加载完成后调用
    if (props.onReady) {
      props.onReady(echartsInstance);
    }
  });

  onCleanup(() => {
    // 组件卸载时销毁图表实例
    echartsInstance?.dispose();
  });

  return <div ref={init} {...attr} />;
};

export default EChartsComponent;
