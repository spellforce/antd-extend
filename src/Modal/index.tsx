import React, { useState, useMemo, useEffect, Component } from 'react';
import ReactDOM from 'react-dom';
import { Modal, ModalProps } from 'antd';
// import PropTypes from 'prop-types';
import './index.less';

interface Props extends ModalProps {
  /**
   * 可以这样写属性描述
   * @description 数据源, 填数组或Promise or async 方法
   * @default []
   */
  width: any;
  className: any;
  onOk: any;
  onCancel: any;
  footer: any;
  children: any;
  deleteConfirm: any;
}

const MyModal = (props: Props) => {
  const { width, className, onOk, onCancel, ...other } = props;
  const [loading, setLoading] = useState(false);
  let { footer = null, children } = props;

  /* eslint-disable react-hooks/exhaustive-deps */
  useMemo(() => {
    if (typeof footer === 'function') {
      footer = footer(onCancel);
    }

    if (typeof children === 'function') {
      children = children(onCancel);
    }
  }, []);

  const listenToPopstate = () => {
    onCancel();
  };

  useEffect(() => {
    window.addEventListener('popstate', listenToPopstate);
    return () => {
      window.removeEventListener('popstate', listenToPopstate);
    };
  }, []);

  async function onOkAction() {
    if (typeof onOk.finally === 'function') {
      setLoading(true);
      await onOk(onCancel).finally(() => setLoading(false));
    } else {
      onOk(onCancel);
    }
  }

  return (
    <Modal
      maskClosable={false}
      centered
      {...other}
      width={width || 900}
      visible
      footer={footer}
      children={children}
      confirmLoading={loading}
      onOk={onOkAction}
      onCancel={onCancel}
      className={`${className ? className : ''} my-modal-wrapper`}
    />
  );
};

MyModal.prototype = Modal.prototype;

MyModal.create = (params) => {
  let container = document.createElement('div');
  document.body.appendChild(container);

  function closeHandle() {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
    container = null;
  }

  ReactDOM.render(<MyModal {...params} onCancel={closeHandle} />, container);
};

// MyModal.show = CustomModal => {
//   let container = document.createElement("div");
//   document.body.appendChild(container);

//   function closeHandle() {
//     ReactDOM.unmountComponentAtNode(container);
//     document.body.removeChild(container);
//     container = null;
//   }

//   ReactDOM.render(
//     <CustomModal visible maskClosable={false} className="my-modal-wrapper" onCancel={closeHandle} />,
//     container
//   );
// };

MyModal.deleteConfirm = (props) => {
  const defaultProps: any = {
    title: 'Delete Row',
    content: 'Are you sure to delete current row?',
    okText: 'OK',
    okType: 'danger',
    cancelText: 'Cancel',
    mask: true,
  };

  if (typeof props === 'function') {
    Modal.confirm({
      ...defaultProps,
      onOk: props,
    });
  } else {
    Modal.confirm({
      ...defaultProps,
      ...props,
    });
  }
};

export default MyModal;
