/* eslint-disable */
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Table, Spin, message, TableProps, Skeleton } from 'antd';
import { generateTitle } from '../Utils';
// import _ from "lodash";
interface TableHookProps {
  reload: () => Promise<any>;
  getFilters: () => Promise<any>;
  setFilters: () => Promise<any>;
  addFilters: () => Promise<any>;
  reset: () => any;
  isEmpty: () => boolean;
  getData: () => [];
  getColumns: () => [];
}

interface Props {
  /**
   * 可以这样写属性描述
   * @description 数据源, 填数组或Promise or async 方法
   * @default []
   */
  columns: any;
  /**
   * @description 默认的过滤
   * @default {}
   */
  filters: any;
  /**
   * 可以这样写属性描述
   * @description 数据源, 填数组或Promise or async 方法
   * @default []
   */
  dataSource: any;
  /**
   * @description 是否加载组件时获取数据，dataSource是异步时有效
   * @default true
   */
  isAutoInit: boolean;
  /**
   * @description 分页大小
   * @default 10
   **/
  pageSize: number;
  /**
   * @description 默认值
   **/
  defaultValue: any;
  tableProps: TableProps<any>;
  /**
   * @description 制定Key字段
   * @default "id"
   **/
  rowKey: string;
  table: TableHookProps;
  hidden: boolean;
  loading: boolean;
}

const FirstLoading = React.memo(({ children, count, loading }: any) => {
  if (count === 0) {
    return (
      <Skeleton loading={loading} active={loading}>
        {children}
      </Skeleton>
    );
  } else {
    return <Spin spinning={loading}>{children}</Spin>;
  }
});

const getColumns = (cols, dataSource) => {
  if (cols.length > 0) {
    return cols;
  }

  if (dataSource.length > 0) {
    let columnSource = Object.keys(dataSource[0]);
    let columns = [];
    for (let i in columnSource) {
      columns.push({
        title: generateTitle(columnSource[i]),
        dataIndex: columnSource[i],
      });
    }
    return columns;
  }

  return [];
};

const PageTable = ({
  columns,
  dataSource,
  pageSize,
  rowKey,
  table,
  filters = {},
  hidden,
  loading,
  isAutoInit = true, // if init load data or not
  tableProps,
}: Props) => {
  pageSize || (pageSize = 10);
  rowKey || (rowKey = 'id');

  const [isServerPage, setIsServerPage] = useState(!(dataSource instanceof Array));
  const [inColumns, setInColumns] = useState(isServerPage ? [] : getColumns(columns, dataSource));
  const [count, setCount] = useState(0);
  const [innerLoading, setLoading] = useState(loading);

  const getSorter = () => {
    const sorter: any = {};
    for (let i in columns) {
      if (columns[i].defaultSortOrder) {
        sorter.field = columns[i].dataIndex;
        sorter.order = columns[i].defaultSortOrder === 'ascend' ? 'ASC' : 'DESC';
      }
      if (columns[i].hidden) {
        delete columns[i];
      }
    }

    return sorter;
  };

  const [tableData, setTableData] = useState({
    pagination: {
      hideOnSinglePage: true,
      current: 1,
      pageSize,
      total: isServerPage ? 0 : dataSource.length,
    },
    filters,
    sorter: getSorter(), // [columnKey order]
    data: isServerPage ? [] : dataSource,
  });

  useEffect(() => {
    if (!hidden && isAutoInit) {
      if (isServerPage) {
        search({ ...tableData, filters });
      } else {
        setTableData({
          ...tableData,
        });
      }
    }
  }, [JSON.stringify(filters)]);

  if (table) {
    table.reload = () => {
      return search(tableData);
    };
    table.getFilters = () => {
      return Promise.resolve(filters);
    };
    table.setFilters = (values = {}) => {
      return search({
        ...tableData,
        pagination: { ...tableData.pagination, current: 1 },
        filters: { ...values, ...filters },
      });
    };
    table.addFilters = (values = {}) => {
      return search({
        ...tableData,
        pagination: { ...tableData.pagination, current: 1 },
        filters: { ...tableData.filters, ...values },
      });
    };
    table.reset = () => {
      // return search({
      //   pagination: { hideOnSinglePage: true, current: 1, pageSize, total: data.length },
      //   filters,
      //   sorter: getSorter(), // [columnKey order]
      //   data,
      // });
    };
    table.isEmpty = () => {
      return !tableData.pagination.total;
    };
    table.getData = () => {
      if (!isServerPage) {
        return tableData.data;
      }
    };
    table.getColumns = () => {
      return inColumns;
    };
  }

  const handleTableChange = (pagination, filters, sorter) => {
    if (isServerPage) {
      search({
        ...tableData,
        pagination,
        sorter,
        filters: { ...tableData.filters, ...filters },
      });
    } else {
      setTableData({
        ...tableData,
        pagination,
        filters,
        sorter,
      });
    }
  };

  const search = (tData) => {
    const { pagination, filters, sorter } = tData;

    let searches = [];
    for (let i in filters) {
      if (filters[i]) {
        searches.push({
          key: i,
          value: filters[i],
        });
      }
    }
    // Arrcording to company spec, you can change this.
    const params = {
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
      search: filters,
      sortField: sorter.order && sorter.field,
      sortDirection: sorter.order && (sorter.order === 'ascend' ? 'ASC' : 'DESC'),
    };

    setLoading(true);

    let innerRequest = dataSource(params);
    return innerRequest
      .then((data) => {
        // const newState = {
        //   ...tData,
        //   pagination: {
        //     ...pagination,
        //     total: data.total,
        //   },
        //   data: data.results
        // }
        setCount(count + 1);
        if (data && data.length !== undefined) {
          tData.pagination.total = data.length;
          tData.data = data;
          setIsServerPage(false);
          if (inColumns.length === 0) {
            setInColumns(getColumns(columns, data));
          }
        } else if (data && data.total !== undefined && data.results) {
          tData.pagination.total = data.total;
          tData.data = data.results;
          setIsServerPage(true);
          if (inColumns.length === 0) {
            setInColumns(getColumns(columns, data.results));
          }
        } else {
          message.error('Table api response format error!');
        }

        setTableData(tData);

        return data;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <FirstLoading count={count} loading={innerLoading}>
      <div hidden={hidden}>
        <Table
          size="small"
          dataSource={tableData.data}
          pagination={tableData.pagination}
          onChange={handleTableChange}
          columns={inColumns}
          bordered
          rowKey={rowKey}
          {...tableProps}
        />
      </div>
    </FirstLoading>
  );
};

PageTable.defaultProps = {
  columns: [],
  dataSource: [],
  loading: false,
};

PageTable.usePageTable = () => {
  const tableRef = useRef({});
  return [tableRef.current];
};

export default PageTable;
