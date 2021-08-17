import React from 'react';
import './index.less';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';

export default (props) => (
  props.value === props.check ? <CheckOutlined className="bv-check"/> : <CloseOutlined type="close" className="bv-close"/>
);