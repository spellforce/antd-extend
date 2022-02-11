import React, { useMemo, useEffect } from "react";
import ReactDOM from "react-dom";
import { Drawer as AntdDrawer } from "antd";
// import PropTypes from 'prop-types';
import "./index.less";

const Drawer = props => {
  const { width, className, onOk, onCancel, ...other } = props;
  let { children } = props;

  /* eslint-disable react-hooks/exhaustive-deps */
  useMemo(() => {
    if (typeof children === "function") {
      children = children(onCancel);
    }
  }, []);

  const listenToPopstate = () => {
    onCancel();
  };

  useEffect(() => {
    window.addEventListener("popstate", listenToPopstate);
    return () => {
      window.removeEventListener("popstate", listenToPopstate);
    };
  }, []);

  return (
    <AntdDrawer
      {...other}
      visible
      children={children}
      onClose={onCancel}
      className={`${className ? className : ""} my-drawer-wrapper`}
    />
  );
};

Drawer.create = params => {
  let container = document.createElement("div");
  document.body.appendChild(container);

  function closeHandle() {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
    container = null;
  }

  ReactDOM.render(<Drawer {...params} onCancel={closeHandle} />, container);
};

export default Drawer;
