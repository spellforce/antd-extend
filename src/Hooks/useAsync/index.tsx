/*
防抖
同时进行一个request
自动/手动触发
优化：只渲染必须渲染的
*/
import { Empty, Skeleton, Spin } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import debounce from 'lodash/debounce';

const isPreset = (payload) => {
  if (payload) {
    if (payload.length && payload.length > 0) {
      return true;
    }
    if (JSON.stringify(payload) !== '{}') {
      return true;
    }
  }

  return false;
};

export const useAsync = (
  request,
  options = {
    debounceInterval: 200, // 防抖时间
    manual: false, // 是否手动触发
  },
) => {
  // const { empty: Nodata } = options;
  const [state, setState] = useState({
    // request count
    count: 0,
    data: undefined,
    loading: false,
  });

  const run = debounce(
    (params) => {
      if (!state.loading) {
        setState({ ...state, loading: true });
        request(params)
          .then((data) => {
            setState((s) => ({ data, loading: false, count: s.count + 1 }));
          })
          .catch(() => {
            setState((s) => ({ ...s, loading: false, count: s.count + 1 }));
          });
      }
    },
    options.debounceInterval,
    { leading: true },
  );

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!options.manual) {
      run();
    }
  }, []);

  // 允许手动更改数据
  const mutate = (data) => {
    setState((s) => ({ ...s, data }));
  };

  return {
    data: state.data,
    count: state.count,
    loading: state.loading,
    refresh: run,
    run,
    mutate,
  };
};

const FirstLoading = React.memo(({ children, count, size, loading }: any) => {
  if (count === 0) {
    return size === 'small' ? (
      <Spin spinning={count === 0}>Loading..</Spin>
    ) : (
      <Skeleton loading={count === 0} active={loading}>
        {children}
      </Skeleton>
    );
  } else {
    return children;
  }
});

export const AsyncLoading = React.memo(
  ({ request, instance, children, options = {}, changeCallback, ...restProps }: any) => {
    const { size } = restProps;
    const { data, loading } = instance.current;
    // console.log("AsyncLoading", {...async})

    return (
      <div {...restProps}>
        {/* {console.log("AsyncLoading render", data, loading, count)} */}
        <FirstLoading size={size} {...instance.current}>
          <Spin spinning={loading}>
            {(isPreset(data) &&
              (typeof children === 'function' ? children(data, instance.current) : children)) ||
              (size === 'small' ? 'No data' : <Empty />)}
          </Spin>
        </FirstLoading>
      </div>
    );
  },
);

// options = {
//   size: null,
//   monitor: 'data'
//   导致父组建刷新的3个级别,
//   monitor: 'loading', 请求的每次变动都刷新父组建，
//   monitor: 'count': 1, 每次请求完成后无论data是否变化都刷新父组建刷新,
//   monitor: 'data': 2, 只有data刷新父组建刷新,
//   monitor: false, data, loading刷新只有子组建刷新（如果子组建用了父组建的state会导致值不刷新）,
// }

const defaultOptions = {
  monitor: 'data',
  manual: false,
};

export const useAsyncLoading = (request, options) => {
  options = { ...defaultOptions, ...options };

  const instance: any = useRef({});
  // const [, refresh] = useState(false);
  // const changeCallback = () => {
  //   options.monitor && refresh(s => !s)
  // };
  instance.current = useAsync(request, options);
  let changeFlag;
  if (options.monitor) {
    changeFlag = () => {
      if (options.monitor === 'loading') {
        return JSON.stringify(instance.current);
      }
      if (options.monitor === 'count') {
        return instance.current.count;
      }
      if (options.monitor === 'data') {
        return JSON.stringify(instance.current.data);
      }
    };
  }
  // console.log("useAsyncLoading")
  const loading = useMemo(
    () =>
      ({ children, ...restProps }) =>
        (
          <AsyncLoading
            request={request}
            instance={instance}
            options={options}
            {...restProps}
            children={children}
          />
        ),
    [changeFlag && changeFlag()],
  );
  return [loading, instance.current];
};
