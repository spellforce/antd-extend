import React from 'react';
import { Row, Col, Form, DatePicker } from 'antd';
import './index.less';


export default (props) => {
  const { label, name, datepickerProps } = props;
  return (
    <Row gutter={24} className="independentRangePicker">
      <Col span={12}>
        <Form.Item label={label} name={name[0]}>
          <DatePicker {...datepickerProps} />
        </Form.Item>
        <div className="connect">
          ～
        </div>
      </Col>
      <Col span={12} className="max">
      <Form.Item name={name[1]}>
        <DatePicker {...datepickerProps} />
      </Form.Item>
      </Col>
    </Row>
  )
}