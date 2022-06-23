---
nav:
  path: /components
---

## LongText

Demo:

```tsx
import React from 'react';
import { LongText } from 'antd-extend-zx';

export default () => (
  <LongText>
    This is a long text. This is a long text. This is a long text. This is a long text.This is a
    long text. This is a long text. This is a long text.{' '}
  </LongText>
);
```

```tsx
/**
 * title: 数据展示
 * desc: 支持数组，json，等格式数据的转化展示
 */
import React from 'react';
import { LongText } from 'antd-extend-zx';

const data = {
  aaaaaaa: 1,
  baaaaaaa: 2,
  Caaaaaaa: 3,
  daaaaaaa: 4,
  eaaaaaaa: 5,
  faaaaaaa: 6,
  gaaaaaaa: 7,
};

const data2 = [1, 3, 4, 5, 6, 7, 1, '1232'];

const data3 = JSON.stringify(data);

export default () => (
  <>
    <LongText>{data}</LongText>
    <br />
    <LongText>{data2}</LongText>
    <br />
    <LongText>{data3}</LongText>
  </>
);
```

```tsx
/**
 * title: 多行
 * desc: rows 设置为2
 */
import React from 'react';
import { LongText } from 'antd-extend-zx';

export default () => (
  <LongText rows={2}>
    This is a long text. This is a long text. This is a long text. This is a long text.This is a
    long text. This is a long text. This is a long text. This is a long text.This is a long text.
    This is a long text. This is a long text. This is a long text.This is a long text. This is a
    long text. This is a long text. This is a long text.
  </LongText>
);
```

```tsx
/**
 * title: 在表格中的使用
 * desc: 在antd table中使用需要注意的是LongText要设置宽度，columns里再设置一次宽度效果最佳，由于antd table自适应用的是colgroup的width，这样做性价比最高
 */
import React from 'react';
import { Table } from 'antd';
import { LongText } from 'antd-extend-zx';

const dataSource = [
  {
    key: '1',
    name: '胡彦斌胡彦斌胡彦斌胡彦斌胡彦斌胡彦斌胡彦斌胡彦斌胡彦斌胡彦斌胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
    textWrap: 'word-break',
    width: 280,
    render: (text) => <LongText width={280}>{text}</LongText>,
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
    width: 280,
  },
];

export default () => <Table dataSource={dataSource} columns={columns} />;
```

<API></API>
