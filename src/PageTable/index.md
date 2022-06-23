---
nav:
  path: /components
# group:
#   path: /components
#   title: Components
---

## PageTable

## 同步数据用法

```tsx
/**
 * title: 同步数据用法 - 最简单用法
 * desc: 直接给数据源，自动创建columns
 */
import React, { useState } from 'react';
import { Space, Card } from 'antd';
import { PageTable } from 'antd-extend-zx';
import { data } from './data';

export default () => <PageTable dataSource={data} rowKey="key" pageSize={5} />;
```

## 异步数据用法

```tsx
/**
 * title: 异步数据用法
 * desc:
 */
import React, { useState } from 'react';
import { Space, Card } from 'antd';
import { PageTable } from 'antd-extend-zx';
import { getData } from './data';

export default () => <PageTable dataSource={getData} rowKey="key" pageSize={5} />;
```

## Hook 控制 与 服务器分页

```tsx
/**
 * title: Hook 控制
 * desc:
 */
import React, { useState } from 'react';
import { Space, Card, Row } from 'antd';
import { PageTable, Modal, Button } from 'antd-extend-zx';
import { getDataServerPage } from './data';

export default () => {
  const [table] = PageTable.usePageTable();

  const onGetColumns = () => {
    Modal.create({
      title: 'Show',
      children: JSON.stringify(table.getColumns(), null, 2),
    });
  };

  return (
    <>
      <Space style={{ marginBottom: 10 }}>
        <Button onClick={onGetColumns}>获取Columns</Button>
        <Button onClick={() => table.reload()}>刷新</Button>
      </Space>
      <PageTable table={table} dataSource={getDataServerPage} rowKey="key" pageSize={5} />
    </>
  );
};
```

## TODO

优化 hook 形式的代码

<API></API>

其他属性与 antd Menu 一致：https://ant.design/components/menu-cn/#API
