---
nav:
  path: /components
# group:
#   path: /components
#   title: Components
---

## DeepMenu

DataProps

```tsx | pure
// 4.20.0 后antd升级了，items同时也可以使用，data是用之前的submenu方式实现的
type DataProps = {
  key: string;
  label?: string;
  [x: string]: any;
  children: Array<DataProps>;
};

const data: DataProps = [
  {
    key: 'x',
    children: [
      {
        key: 'x-1',
        label: 'X-1',
        test: 'xx-1',
      },
      {
        key: 'x-2',
        label: 'X-2',
        test: 'xx-2',
      },
    ],
  },
];

return <Menu data={menu} />;
```

```tsx
/**
 * title: 简单用法
 * desc: 请查看浏览器url，可以自动定位菜单，自动选中，默认选择第一个
 */
import React, { useState } from 'react';
import { Row, Col, Card } from 'antd';
import { DeepMenu } from 'antd-extend-zx';

const data = [
  {
    key: 'x',
    children: [
      {
        key: 'x-1',
        label: 'X-1',
        test: 'xx-1',
      },
      {
        key: 'x-2',
        label: 'X-2',
        test: 'xx-2',
      },
    ],
  },
];

export default () => {
  const [content, setContent] = useState();

  const onSelect = (props) => {
    console.dir(props);
    setContent(JSON.stringify(props));
  };

  return (
    <Row gutter={12}>
      <Col span={8}>
        <DeepMenu data={data} mode="inline" onSelect={onSelect} />
      </Col>
      <Col span={16}>
        <Card>{content}</Card>
      </Col>
    </Row>
  );
};
```

```tsx
/**
 * title: 设置url的key name
 * desc: 多个DeepMenu必须设置，单个想要别的key name时也可以设置，效果查看浏览器url
 */
import React, { useState } from 'react';
import { Row, Col, Card } from 'antd';
import { DeepMenu } from 'antd-extend-zx';

const data = [
  {
    key: 'x',
    children: [
      {
        key: 'x-1',
        label: 'X-1',
        test: 'xx-1',
      },
      {
        key: 'x-2',
        label: 'X-2',
        test: 'xx-2',
      },
    ],
  },
];

export default () => {
  const [content, setContent] = useState();

  const onSelect = (props) => {
    console.dir(props);
    setContent(JSON.stringify(props));
  };

  return (
    <Row gutter={12}>
      <Col span={8}>
        <DeepMenu keyName="testName" data={data} mode="inline" onSelect={onSelect} />
      </Col>
      <Col span={16}>
        <Card>{content}</Card>
      </Col>
    </Row>
  );
};
```

## API

修改的按钮的属性说明如下：

| 属性     | 说明                       | 类型        | 默认值 | 版本 |
| -------- | -------------------------- | ----------- | ------ | ---- |
| onSelect | 点击后的回调({item, key}） | -           |        |
| data     | 菜单内容                   | DataProps[] | -      |      |
| keyName  | 显示在 url 上的参数名称    | string      | -      |      |

其他属性与 antd Menu 一致：https://ant.design/components/menu-cn/#API
