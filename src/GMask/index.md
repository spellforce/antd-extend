---
nav:
  path: /components
---

## GMask

优点:

1. 可以直接用 JS 调用
2. 生成和销毁都是临时的，不用考虑父子状态判断刷新等
3. 栈队列生产和销毁，类似 Promise all

```tsx
import React from 'react';
import { GMask, Button } from 'antd-extend-zx';

const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const onClick = async () => {
  GMask.mask();
  await timeout(2000);
  GMask.unmask();
};

const onClick2 = async () => {
  // 会等待全部结束才会unmask
  GMask.mask();
  GMask.mask();
  await timeout(2000);
  GMask.unmask();
  await timeout(2000);
  GMask.unmask();
};

export default () => (
  <>
    <Button onClick={onClick}>执行1次</Button>
    <br />
    <br />
    <Button onClick={onClick2}>执行2次</Button>
  </>
);
```

```tsx
/**
 * title: 自定义
 * desc: 调用 GMask.setMask 全局设置自己的Mask组件， 默认是Spin组件
 */
import React from 'react';
import { Spin } from 'antd';
import { GMask, Button } from 'antd-extend-zx';

const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const onClick = async () => {
  GMask.mask();
  await timeout(2000);
  GMask.unmask();
};

const setMask = async () => {
  GMask.setMask(<Spin size="small" />);
};

export default () => (
  <>
    <Button onClick={setMask}>SetMask</Button>
    <br />
    <br />
    <Button onClick={onClick}>Click</Button>
  </>
);
```

## API

修改的按钮的属性说明如下：

| 属性    | 说明              | 类型     | 默认值 | 版本 |
| ------- | ----------------- | -------- | ------ | ---- |
| mask    | 调用方法添加 mask | Function |        |      |
| unmask  | 调用方法去掉 mask | Function | -      |      |
| setMask | 设置 Mask 的内容  | Function | -      |      |
