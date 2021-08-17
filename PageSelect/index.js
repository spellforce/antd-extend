import React, { useEffect, useState } from "react";
import { Select, Pagination, Spin } from "antd";

const Option = Select.Option;
let timeout;
// let DV = null;
let locked = null;

const PageSelect = ({ data = [], api, filters = {}, searchKey, format, pageProps, isAutoInit = true, defaultValue, ...rest}) => {
  // console.log(rest)
  const [pageData, setPageData] = useState({
    current: 1,
    total: 0,
    pageSize: 5,
    filters,
    data,
    open: false,
  });

  const [isServerPage, setIsServerPage] = useState(!!api);
  const [loading, setLoading] = useState(false);
  const [DV, setDV] = useState(defaultValue);

  useEffect(() => {
    if (isAutoInit) {
      search();
    }
  }, []);
  
  const changePage = pageIndex => {
    if (isServerPage) {
      search({ pageIndex, isOpen: true });
    } else {
      setPageData({
        ...pageData,
        current: pageIndex,
      });
    }
  };

  const search = (options = {}) => {
    const { pageIndex = 1, value, isOpen = false } = options;

    let filters = pageData.filters;

    if (value !== undefined ) {
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
    return api(params)
      .then(data => {
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

  const toggle = isOpen => {
    if (!locked) {
      if (isOpen && isServerPage && !pageData.total) {
        search({ isOpen });
      } else {
        setPageData({ ...pageData, open: isOpen });
      }
    }
  };

  const handleSearch = value => {
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

  const lockClose = e => {
    clearTimeout(locked);
    locked = setTimeout(() => {
      locked = null;
    }, 100);
  };

  return (
    <Select
      placeholder="Please Select"
      showSearch={!!searchKey}
      filterOption={false}
      onSearch={!!searchKey && handleSearch}
      {...rest}
      onDropdownVisibleChange={toggle}
      open={pageData.open}
      dropdownRender={menu => (
        <Spin spinning={loading}>
          {menu}
          {/* <Divider style={{ margin: "0" }} /> */}
          {pageData.data.length && (
            <div style={{ padding: "8px", textAlign: "center" }} onMouseDown={lockClose} onMouseUp={lockClose}>
              <Pagination
                {...pageProps}
                simple
                // size="small"
                current={pageData.current}
                total={pageData.total}
                pageSize={pageData.pageSize}
                onChange={changePage}
              />
            </div>
          )}
        </Spin>
      )}
    >
      {getPageData().map(item => {
        if (DV) {
          const [name, value] = item;
          return (
            <Option key={value} value={value}>
              {name}
            </Option>
          );
        } else {
          if (format) {
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
              temp.props.source = item;
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

export default PageSelect;
