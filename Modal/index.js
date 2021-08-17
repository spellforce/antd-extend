import React, { useState, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Modal } from 'antd';
// import PropTypes from 'prop-types';
import './index.less';

const MyModal = props => {
  const { width, className, onOk, onCancel, ...other } = props;
  const [loading, setLoading] = useState(false);
  let { footer, children } = props;

  /* eslint-disable react-hooks/exhaustive-deps */
  useMemo(() => {
    if (typeof footer === 'function') {
      footer = footer(onCancel);
    }

    if (typeof children === 'function') {
      children = children(onCancel);
    }
  }, []);

  async function onOkAction() {
    if (typeof onOk.finally === 'function') {
      setLoading(true);
      await onOk(onCancel).finally(() => setLoading(false));
    } else {
      onOk(onCancel);
    }
    onCancel();
  }

  return (
    <Modal
      maskClosable={false}
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
  )
};

MyModal.create = (params) => {
  let container = document.createElement('div');
  document.body.appendChild(container);

  function closeHandle() {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
    container = null;
  }

  ReactDOM.render(
    <MyModal {...params} onCancel={closeHandle} />,
    container,
  );
};

MyModal.show = (CustomModal) => {
  let container = document.createElement('div');
  document.body.appendChild(container);

  function closeHandle() {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
    container = null;
  }

  ReactDOM.render(
    <CustomModal visible maskClosable={false} className="my-modal-wrapper" onCancel={closeHandle} />,
    container,
  );
};

MyModal.deleteConfirm = props => {
  const defaultProps = {
    title: 'Delete Row',
    content: "Are you sure to delete current row?",
    okText: "OK",
    okType: "danger",
    cancelText: "Cancel",
    mask: true,
  };

  if (typeof props === "function") {
    Modal.confirm({
      ...defaultProps,
      onOk: props
    });
  } else {
    Modal.confirm({
      ...defaultProps,
      ...props
    });
  }
}

MyModal.confirm = props => {
  Modal.confirm(props);
}

export default MyModal;
