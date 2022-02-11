/* eslint-disable */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Table, Spin, message } from "antd";
import PropTypes from "prop-types";
import Axios from "axios";
// import _ from "lodash";

// Class PageTableStore {

// }

const PageTable = ({
  columns,
  api,
  data,
  pageSize,
  rowKey,
  header,
  footer, // the content is for in loading spin
  table,
  filters = {},
  hidden,
  loading,
  isInitSearch = true, // if init load data or not
  ...other
}) => {
  data || (data = []);
  pageSize || (pageSize = 10);
  rowKey || (rowKey = "id");

  // let isServerPage = !!api;

  const getSorter = () => {
    const sorter = {};
    for (let i in columns) {
      if (columns[i].defaultSortOrder) {
        sorter.field = columns[i].dataIndex;
        sorter.order = columns[i].defaultSortOrder === "ascend" ? "ASC" : "DESC";
      }
      if (columns[i].hidden) {
        delete columns[i];
      }
    }

    return sorter;
  };

  const [tableData, setTableData] = useState({
    pagination: { hideOnSinglePage: true, current: 1, pageSize, total: data.length },
    filters,
    sorter: getSorter(), // [columnKey order]
    data,
  });
  const [isServerPage, setIsServerPage] = useState(!!api);
  const [innerLoading, setLoading] = useState(false);

  // const changeFlag = api ? [tableData.pagination.current, tableData.sorter, tableData.filters] : [];

  useEffect(() => {
    if (!hidden && isInitSearch) {
      if (isServerPage) {
        search({ ...tableData, filters });
      } else {
        setTableData({
          ...tableData,
          data,
        });
      }
    }
  }, [JSON.stringify(filters), JSON.stringify(data)]);

  if (table) {
    table.reload = () => {
      if (api) {
        return search(tableData);
      }
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
      return search({
        pagination: { hideOnSinglePage: true, current: 1, pageSize, total: data.length },
        filters,
        sorter: getSorter(), // [columnKey order]
        data,
      });
    };
    table.isEmpty = () => {
      return !tableData.pagination.total;
    };
    table.getData = () => {
      if (!isServerPage) {
        return tableData.data;
      }
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

  const search = tData => {
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
      sortDirection: sorter.order && (sorter.order === "ascend" ? "ASC" : "DESC"),
    };

    setLoading(true);

    let innerRequest;
    if (typeof api === "function") {
      innerRequest = api(params);
    } else {
      innerRequest = Axios.post(api, params, { mask: false });
    }
    return innerRequest
      .then(data => {
        // const newState = {
        //   ...tData,
        //   pagination: {
        //     ...pagination,
        //     total: data.total,
        //   },
        //   data: data.results
        // }
        if (data && data.length !== undefined) {
          tData.pagination.total = data.length;
          tData.data = data;
          setIsServerPage(false);
        } else if (data && data.total !== undefined && data.results) {
          tData.pagination.total = data.total;
          tData.data = data.results;
          setIsServerPage(true);
        } else {
          message.error("Table api response format error!");
        }

        setTableData(tData);

        return data;
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Spin spinning={loading !== undefined ? false : innerLoading}>
      {header}
      <div hidden={hidden}>
        <Table
          size="small"
          dataSource={tableData.data}
          pagination={tableData.pagination}
          onChange={handleTableChange}
          columns={columns}
          bordered
          rowKey={rowKey}
          {...other}
        />
      </div>
      {footer}
    </Spin>
  );
};

PageTable.usePageTable = () => {
  const tableRef = useRef({});
  return [tableRef.current];
}

PageTable.propTypes = {
  columns: PropTypes.array.isRequired,
  rowKey: PropTypes.string.isRequired,
};

export default PageTable;
