import { Empty, Skeleton, Spin } from "antd";
import React, { useEffect, useMemo, useState } from "react";

const isPreset = payload => {
  if (payload) {
    if (payload.length && payload.length > 0) {
      return true;
    }
    if (JSON.stringify(payload) !== "{}") {
      return true;
    }
  }

  return false;
};

export const useAysnc = (request, options = { size: "normal" }) => {
  // const { empty: Nodata } = options;
  const [state, setState] = useState({
    initalLoading: true,
    data: undefined,
    loading: false,
  });

  const initData = () => {
    setState({ ...state, loading: true });
    request()
      .then(data => {
        setState({ data, loading: false, initalLoading: false });
      })
      .catch(() => {
        setState({ ...state, loading: false, initalLoading: false });
      });
  };

  const FirstLoading = ({ children }) => {
    if (state.initalLoading) {
      return options.size === "small" ? (
        <Spin spinning={state.initalLoading}>Loading..</Spin>
      ) : (
        <Skeleton loading={state.initalLoading} active>
          {children}
        </Skeleton>
      );
    } else {
      return children;
    }
  };

  const Component = useMemo(() => {
    return ({ children }) => (
      <FirstLoading>
        <Spin spinning={state.loading}>
          {(isPreset(state.data) && (typeof children === "function" ? children(state.data) : children)) ||
            (options.size === "small" ? "No data" : <Empty />)}
        </Spin>
      </FirstLoading>
    )
  }, [state.loading, state.data]);

  useEffect(initData, []);

  return [
    Component,
    state.data,
    { refresh: initData, loading: state.loading },
  ];
};
