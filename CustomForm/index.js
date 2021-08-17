import React, { useState } from "react";
import { Form, Row, Col, Button } from "antd";
import FormColumns from "../FormColumns";

const getColumnsFormAntdTable = (antdTableColumns = []) => {
  antdTableColumns.map(({ title, dataIndex, form, ...rest }) => {
    return {
      label: title,
      name: dataIndex,
      ...rest,
      form,
    };
  });
};

const CustomForm = props => {
  /* 
  actions = {
    text: '',
    onFinish: (values) => {}
  }
  actions = {
    (form) => {}
  }
  */
  let { columns, antdTableColumns, onReset, actions = {}, span = 6, ...rest } = props;
  const { text, onFinish, ...actionRest } = actions;
  const [loading, setLoading] = useState(false);

  const form = props.form || Form.useForm()[0];
  // if antd table columns
  if (!columns && antdTableColumns) {
    columns = getColumnsFormAntdTable(antdTableColumns);
  }

  const handleReset = () => {
    form.resetFields();
    onReset &&
      form
        .validateFields()
        .then(values => {
          setLoading(true);
          return onReset(values, form);
        })
        .finally(() => setLoading(false));
  };

  const onInnerFinish = () => {
    actions.onFinish &&
      form
        .validateFields()
        .then(values => {
          setLoading(true);
          return actions.onFinish(values, form);
        })
        .finally(() => setLoading(false));
  };

  return (
    <Form layout="vertical" form={form} onFinish={onInnerFinish} {...rest}>
      <Row gutter={24}>
        {columns && <FormColumns row={false} columns={columns} span={span} form={form} />}
        <Col span={24} className="operations center">
          {actions.text ? (
            <Button type="primary" htmlType="submit" loading={loading} size="small" {...actionRest}>
              {actions.text}
            </Button>
          ) : (
            actions(form)
          )}
          <Button onClick={handleReset} size="small">
            Reset
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default CustomForm;
