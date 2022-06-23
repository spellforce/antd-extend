---
nav:
  path: /components
# group:
#   path: /components
#   title: Components
---

## PageSelect

```tsx
/**
 * title: 同步数据用法
 * desc: 直接给数据源
 */
import React, { useState } from 'react';
import { Row, Col, Card } from 'antd';
import { PageSelect } from 'antd-extend-zx';

const data = [1, 2, 'a', 'b'];

export default () => {
  const [content, setContent] = useState();

  const onSelect = (props) => {
    console.dir(props);
    setContent(JSON.stringify(props));
  };

  return (
    <Row gutter={12}>
      <Col span={8}>
        <PageSelect dataSource={data} onSelect={onSelect} />
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
 * title: 异步数据
 * desc: 从服务端获取数据源(自动判断是否服务器分页，但需要满足格式"{total:0,result:[]}")
 */
import React, { useState } from 'react';
import { Row, Col, Card } from 'antd';
import { PageSelect } from 'antd-extend-zx';

const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getData = async () => {
  await timeout(2000);
  return ['a', 'b', 'c', 'd', 'e', 'f'];
};

const getDataPromise = () => {
  return timeout(2000).then(() => {
    return [
      { n: 1, v: 'a' },
      { n: 2, v: 'b' },
    ];
  });
};

export default () => {
  const [content, setContent] = useState();

  const onSelect = (props) => {
    console.dir(props);
    setContent(JSON.stringify(props));
  };

  return (
    <Row gutter={12}>
      <Col span={8}>
        <Row>
          <Col span={24}>
            <PageSelect dataSource={getData} onSelect={onSelect} />
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <PageSelect
              dataSource={getDataPromise}
              format={(item) => [item.n, item.v]}
              onSelect={onSelect}
            />
          </Col>
        </Row>
      </Col>
      <Col span={16}>
        <Card>{content}</Card>
      </Col>
    </Row>
  );
};
```

<API></API>

其他属性与 antd Menu 一致：https://ant.design/components/menu-cn/#API
