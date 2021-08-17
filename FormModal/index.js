import React, { useMemo, useState } from 'react';
import ReactDOM from 'react-dom';
import { Modal, Form } from 'antd';
import PropTypes from 'prop-types';
import './index.less';

const FormModal = params => {
  const {
    className,
    width,
    onOk,
    onCancel,
    ...other
  } = params;
  let { title, children } = params;
  const form = Form.useForm()[0];
  const [loading, setLoading] = useState(false);

  /* eslint-disable react-hooks/exhaustive-deps */
  useMemo(() => {
    if (typeof title === 'function') {
      title = title(form, onCancel);
    }
  
    if (typeof children === 'function') {
      children = children(form, onCancel);
    }
  }, []);

  async function handleSubmit() {
    const values = await form.validateFields();
    if (typeof onOk.finally === 'function') {
      setLoading(true);
      await onOk(values).finally(() => setLoading(false));
    } else {
      onOk(values);
    }
    onCancel();
  }

  return (
    <Modal
      maskClosable={false}
      {...other}
      onCancel={onCancel}
      visible
      title={title}
      children={children}
      onOk={handleSubmit}
      confirmLoading={loading}
      className={`${className || ''} dialog-wrapper`}
      width={width || 680}
    />
  );
};

FormModal.create = (params) => {
  let container = document.createElement('div');
  document.body.appendChild(container);

  function closeHandle() {
    ReactDOM.unmountComponentAtNode(container);
    document.body.removeChild(container);
    container = null;
  }

  ReactDOM.render(
    <FormModal {...params} onCancel={closeHandle} />,
    container,
  );
};

FormModal.propTypes = {
  onOk: PropTypes.func.isRequired,
  title: PropTypes.string,
  formData: PropTypes.instanceOf(Object),
  width: PropTypes.number,
};

export default FormModal;
