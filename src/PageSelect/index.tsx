import React, { useEffect, useState } from 'react';
import { Select, Pagination, Spin, PaginationProps } from 'antd';

const Option = Select.Option;
let timeout: any;
// let DV = null;
let locked: any = null;

interface Props {
  /**
   * 可以这样写属性描述
   * @description 数据源, 填数组或Promise or async 方法
   * @default []
   */
  dataSource: any;
  /**
   * @description 默认的过滤
   * @default {}
   */
  filters: any;
  /**
   * @description 开启搜索功能，填入用户搜索的key
   * @default ""
   */
  searchKey: string;
  /**
   * @description 展示Option的控制格式,  [name, value] name 和 value 可以是ReactDom
   * @default
   */
  format: (item: any) => any[];
  /**
   * @description 是否加载组件时获取数据，dataSource是异步时有效
   * @default true
   */
  isAutoInit: boolean;
  /**
   * @description 分页组件的参数
   */
  pageProps: PaginationProps;
  /**
   * @description 默认值
   */
  defaultValue: any;
}

const PageSelect = ({
  dataSource,
  filters,
  searchKey,
  format,
  pageProps,
  isAutoInit,
  defaultValue,
  ...rest
}: Props) => {
  // console.log(rest)
  const [isServerPage, setIsServerPage] = useState(!(dataSource instanceof Array));
  const [pageData, setPageData] = useState({
    current: 1,
    total: isServerPage ? 0 : dataSource.length,
    pageSize: 5,
    filters,
    data: isServerPage ? [] : dataSource,
    open: false,
  });

  const [loading, setLoading] = useState(false);
  const [DV, setDV] = useState(defaultValue);

  useEffect(() => {
    if (isAutoInit && isServerPage) {
      search();
    }
  }, []);

  const changePage = (pageIndex) => {
    if (isServerPage) {
      search({ pageIndex, isOpen: true });
    } else {
      setPageData({
        ...pageData,
        current: pageIndex,
      });
    }
  };

  const search = (options: any = {}) => {
    const { pageIndex = 1, value, isOpen = false } = options;

    let filters = pageData.filters;

    if (value !== undefined) {
      filters[`${searchKey}`] = value;
    }

    const params = {
      pagination: {
        current: pageIndex || pageData.current,
        pageSize: pageData.pageSize,
      },
      search: filters,
    };
    setDV(null);
    setLoading(true);
    return dataSource(params)
      .then((data) => {
        if (data.results) {
          setPageData({
            ...pageData,
            current: pageIndex,
            total: data.total,
            data: data.results,
            open: isOpen, // open must be true
          });
        } else {
          setPageData({
            ...pageData,
            current: pageIndex,
            total: data.length,
            data: data,
            open: isOpen,
          });
          setIsServerPage(false);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const toggle = (isOpen) => {
    if (!locked) {
      if (isOpen && isServerPage && !pageData.total) {
        search({ isOpen });
      } else {
        setPageData({ ...pageData, open: isOpen });
      }
    }
  };

  const handleSearch = (value) => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }

    if (isServerPage && searchKey) {
      const pageIndex = 1;
      setLoading(true);
      timeout = setTimeout(() => {
        search({ pageIndex, value, isOpen: true });
      }, 500);
    }
  };

  const getPageData = () => {
    const { current, pageSize, data, total } = pageData;
    if (isServerPage) {
      if (DV) {
        return [DV];
      }
      return data;
    } else {
      let result = [];
      for (let i = (current - 1) * pageSize; i < current * pageSize; i++) {
        if (i >= total) break;
        result.push(data[i]);
      }
      return result;
    }
  };

  const lockClose = (e) => {
    clearTimeout(locked);
    locked = setTimeout(() => {
      locked = null;
    }, 100);
  };

  return (
    <Select
      placeholder="Please select"
      showSearch={!!searchKey}
      filterOption={false}
      onSearch={!!searchKey && handleSearch}
      dropdownStyle={{ minWidth: 176 }}
      loading={loading}
      {...rest}
      onDropdownVisibleChange={toggle}
      open={pageData.open}
      style={{ width: '100%' }}
      dropdownRender={(menu) => (
        <Spin spinning={loading}>
          {menu}
          {pageData.data.length ? (
            <div
              style={{ padding: '8px', textAlign: 'center' }}
              onMouseDown={lockClose}
              onMouseUp={lockClose}
            >
              <Pagination
                {...pageProps}
                simple
                current={pageData.current}
                total={pageData.total}
                pageSize={pageData.pageSize}
                onChange={changePage}
              />
            </div>
          ) : null}
        </Spin>
      )}
    >
      {getPageData().map((item) => {
        if (DV) {
          // defaultValue
          const [name, value] = item;
          return (
            <Option key={value} value={value}>
              {name}
            </Option>
          );
        } else {
          if (format && typeof format === 'function') {
            // const key = (format && format.value) || 'self';
            // const value = key === 'self' ? JSON.stringify(item) : item[key];
            // return <Option key={value} value={value}>{item[format.name || 'name']}</Option>;
            const temp = format(item);
            if (temp.length) {
              const [name, value] = temp;
              return (
                <Option key={value} value={value} source={item} title={name}>
                  {name}
                </Option>
              );
            } else {
              console.error('You need return array to format');
              return temp;
            }
          } else {
            return (
              <Option key={item.toString()} value={item.toString()} title={item.toString()}>
                {item.toString()}
              </Option>
            );
          }
        }
      })}
    </Select>
  );
};

PageSelect.defaultProps = {
  data: [],
  filters: {},
  isAutoInit: true,
};

export default PageSelect;
