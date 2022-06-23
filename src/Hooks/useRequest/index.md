---
nav:
  path: /components
group:
  path: /hooks
  title: Hooks
---

## useRequest

与 useAysnc 的区别是: useAysnc 的核心是数据 useRequest 的核心是异步方法

```tsx
/**
 * title: request 绑定 loading
 * desc: 直接给数据源
 */
import React, { useState } from 'react';
import { Space, Button, Spin } from 'antd';
import { useRequest } from 'antd-extend-zx';

const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getData = async () => {
  await timeout(2000);
  return ['a', 'b', 'c', 'd', 'e', 'f'];
};

export default () => {
  const [loading, request] = useRequest(getData);

  const onPress = async () => {
    const data = await request();
    console.dir(data);
  };

  return (
    <Space>
      <Button size="small" onClick={onPress} loading={loading}>
        Request
      </Button>
      <Spin spinning={loading}>This is a Spin</Spin>
    </Space>
  );
};
```

```tsx
/**
 * title: request 绑定 Loading 动画
 */
import React, { useState, useEffect } from 'react';
import { Space, Button, Spin } from 'antd';
import { useRequestLoading } from 'antd-extend-zx';

const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

const getData = async () => {
  await timeout(2000);
  return ['a', 'b', 'c', 'd', 'e', 'f'];
};

export default () => {
  const [Loading, request] = useRequestLoading(getData);

  console.log('Father');
  useEffect(() => {
    onPress();
  }, []);

  const onPress = async () => {
    // console.log(request);
    const data = await request();
    console.dir(data);
  };

  return (
    <>
      <Loading>
        <Button size="small" onClick={onPress}>
          Request
        </Button>
      </Loading>
      Not need loading
      <Loading>This is a Spin</Loading>
      Not need loading
      <Loading>This is a Spin</Loading>
    </>
  );
};
```

<API></API>
