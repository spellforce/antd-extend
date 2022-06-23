/*
防抖
同时进行一个request
自动/手动触发
优化：只渲染必须渲染的
*/
import { Empty, Skeleton, Spin } from 'antd';
import React, { useMemo, useState } from 'react';

interface requestProps {
  /**
   * @description 防抖时间ms
   * @default 500
   **/
  debounceInterval?: number;
  /**
   * @description size
   * @default normal
   **/
  size?: 'small' | 'normal';
}

export const useRequest = (
  request,
  options: requestProps = {
    debounceInterval: 500, // 防抖时间
  },
) => {
  // const { empty: Nodata } = options;
  const [state, setState] = useState({
    // request count
    count: 0,
    loading: false,
    time: 0,
  });

  const run = (params) =>
    new Promise((resolve, reject) => {
      const current: any = Date.now();
      // console.log(current, state.time, current - state.time);
      if (current - state.time > options.debounceInterval) {
        // setState(s => ({ ...s, time: current }));
        state.time = current;
        if (!state.loading) {
          setState({ ...state, loading: true });
          request(params)
            .then((data) => {
              setState((s) => ({ ...s, loading: false, count: s.count + 1 }));
              // return data;
              resolve(data);
            })
            .catch((err) => {
              setState((s) => ({ ...s, loading: false, count: s.count + 1 }));
              // return err;
              reject(err);
            });
        }
      } else {
        reject('The operation is too fast');
      }
    });

  return [state.loading, run, state.count];
};

const FirstLoading = ({ children, count, size, loading }: any) => {
  if (count === 0) {
    return size === 'small' ? (
      <Spin spinning={loading}>Loading..</Spin>
    ) : (
      <Skeleton loading={loading} active={loading}></Skeleton>
    );
  } else {
    return <Spin spinning={loading}>{children}</Spin>;
  }
};

const defaultOptions: requestProps = {
  size: 'normal',
  debounceInterval: 500,
};

export const useRequestLoading = (request, options: requestProps) => {
  options = { ...defaultOptions, ...options };

  // const instance:any = useRef({});
  const [loading, rq, count] = useRequest(request, options);
  // const [loading, rq, count] = useRequest(request, options);

  const loadingDom = useMemo(
    () =>
      ({ children, ...restProps }) => {
        // const [loading, rq, count] = instance.current;
        // console.log(loading,count, "loadingDom")
        // instance.current.loading = loading;
        // if (!instance.current.request) {
        //   instance.current.request = rq;
        //   refresh(s => !s);
        // }

        return (
          <div {...restProps}>
            <FirstLoading size={options.size} count={count} loading={loading}>
              {(typeof children === 'function' ? children() : children) ||
                (options.size === 'small' ? 'No data' : <Empty />)}
            </FirstLoading>
          </div>
        );
      },
    [loading],
  );
  return [loadingDom, rq, loading, count];
};
