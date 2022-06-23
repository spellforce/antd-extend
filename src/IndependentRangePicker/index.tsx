import React from 'react';
import { Row, Col, Form, DatePicker, DatePickerProps } from 'antd';
import './index.less';

interface Props {
  /**
   * 可以这样写属性描述
   * @description
   * @description.zh-CN 传[{key, tile, children}] 类型的数据
   * @default []
   */
  name: Array<string>;
  /**
   * @description
   * @description.zh-CN 传[{key, tile, children}] 类型的数据
   * @default key
   */
  label: string;
  datepickerProps: DatePickerProps;
}

export default (props: Props) => {
  const { label, name, datepickerProps } = props;
  return (
    <Row gutter={24} className="independentRangePicker">
      <Col span={12}>
        <Form.Item label={label} name={name[0]}>
          <DatePicker {...datepickerProps} />
        </Form.Item>
        <div className="connect">～</div>
      </Col>
      <Col span={12} className="max">
        <Form.Item name={name[1]}>
          <DatePicker {...datepickerProps} />
        </Form.Item>
      </Col>
    </Row>
  );
};
