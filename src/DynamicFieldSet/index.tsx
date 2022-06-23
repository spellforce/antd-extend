import React from 'react';
import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

const uniquePush = (source, data) => {
  for (const i in source) {
    if (source[i].required === data.required) {
      return false;
    }
  }

  source.push(data);
};

const DynamicFieldSet = ({ label, name, children, ...other }) => {
  if (other.required) {
    other.rules || (other.rules = []);
    const temp = { required: true, message: `${label} is required.` };
    uniquePush(other.rules, temp);
  }

  return (
    <Form.List name={name} {...other}>
      {(fields, { add, remove }, { errors }) => (
        <Form.Item label={label} required={other.required}>
          {fields.map((field, index) => (
            <Form.Item key={field.key}>
              <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                {children ? (
                  children(field)
                ) : (
                  <Form.Item {...field} noStyle>
                    <Input />
                  </Form.Item>
                )}
                <MinusCircleOutlined
                  className="dynamic-delete-button"
                  style={{ color: 'red' }}
                  onClick={() => remove(field.name)}
                />
              </Space>
            </Form.Item>
          ))}
          <Form.Item>
            <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
              Add {label}
            </Button>
            <Form.ErrorList errors={errors} />
          </Form.Item>
        </Form.Item>
      )}
    </Form.List>
  );
};

export default DynamicFieldSet;
