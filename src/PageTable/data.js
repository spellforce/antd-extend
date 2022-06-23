export const data = [
  {
    key: '1',
    name: '胡彦斌',
    age: 32,
    address: '西湖区湖底公园1号',
  },
  {
    key: '2',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
  {
    key: '3',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
  {
    key: '4',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
  {
    key: '5',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
  {
    key: '6',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
  {
    key: '7',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
  {
    key: '8',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
  {
    key: '9',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
  {
    key: '10',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
  {
    key: '11',
    name: '胡彦祖',
    age: 42,
    address: '西湖区湖底公园1号',
  },
];

const timeout = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const getData = async () => {
  await timeout(2000);
  return data;
};

export const getDataServerPage = async (params) => {
  const { pagination } = params;
  let results = [];
  for (
    let i = (pagination.current - 1) * pagination.pageSize;
    i < pagination.current * pagination.pageSize;
    i++
  ) {
    if (i >= data.length) break;
    results.push(data[i]);
  }
  await timeout(2000);
  return {
    total: data.length,
    results: results,
  };
};
