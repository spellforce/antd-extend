---
nav:
  path: /components
# group:
#   path: /components
#   title: Components
---

## Button

```tsx
/**
 * title: 异步点击
 * desc: 点击按钮时的回调，可以传异步方法（Promise, Async），异步时有加载动画
 */
import React from 'react';
import { Button } from 'antd-extend-zx';

const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const PromiseRequest = () => {
  return timeout(2000).then(() => {
    console.log('PromiseRequest');
  });
};

const AsyncRequest = async () => {
  await timeout(2000);
  console.log('AsyncRequest');
};

const handleClick = () => {
  console.log('clicked');
};

export default () => (
  <>
    <Button onClick={PromiseRequest}>onClick promise</Button>
    <pre />
    <Button onClick={AsyncRequest}>onClick async</Button>
    <pre />
    <Button onClick={handleClick}>onClick sync</Button>
  </>
);
```

```tsx
/**
 * title: Title
 * desc: 修改了title属性，用tooltip展示title
 */
import React from 'react';
import { Button } from 'antd-extend-zx';

export default () => <Button title="This is a button">Button</Button>;
```

## API

修改的按钮的属性说明如下：

| 属性 | 说明 | 类型 | 默认值 | 版本 |
| --- | --- | --- | --- | --- |
| onClick | 点击按钮时的回调，可以传异步方法（Promise, Async），异步时有加载动画 | (event) => void | - |  |
| tilte | title 用 tooltip 展示 | string \| React | - |  |

其他属性与 antd button 一致：https://ant.design/components/button-cn/#API
