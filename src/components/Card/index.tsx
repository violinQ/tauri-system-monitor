import { Component, JSX, mergeProps, Show } from 'solid-js';

import './index.css';

interface CardProps
  extends Pick<
    JSX.HTMLAttributes<HTMLDivElement>,
    'class' | 'classList' | 'children'
  > {
  /* 标题文本 输入空字符串时 Card 没有 title */
  title: JSX.Element;
  /* Card 边框 */
  border?: boolean;
  /* Card 样式 */
  style?: JSX.CSSProperties;
}

const Card: Component<CardProps> = (cardProps) => {
  const props = mergeProps(
    {
      class: '',
      classList: {},
      style: {},
    },
    cardProps,
  );
  const cardClass = () => (props.border !== false ? 'card' : 'card-default');

  return (
    <div
      class={`${cardClass()} ${props.class}`}
      classList={props.classList}
      style={props.style}
    >
      <Show when={props.title}>
        <div class="card-header">{props.title}</div>
      </Show>
      <div class="card-body">{props.children}</div>
    </div>
  );
};

export default Card;
