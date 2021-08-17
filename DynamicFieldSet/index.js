
import React from "react";
import { Form, Input, Button, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

export default ({label, name, children, ...other}) => {
  return (
    <Form.List
      name={name}
      {...other}
    >
      {(fields, { add, remove }, { errors }) => (
        <Form.Item label={label}>
          {fields.map((field, index) => (
            <Form.Item
              required={false}
              key={field.key}
            >
              <Space style={{ display: 'flex', marginBottom: 8 }} align="baseline">
                { children ? children(field) : (
                    <Form.Item {...field} noStyle>
                      <Input />
                    </Form.Item>
                  )
                }
                <MinusCircleOutlined
                  className="dynamic-delete-button"
                  onClick={() => remove(field.name)}
                />
              </Space>
            </Form.Item>
          ))}
          <Form.Item>
            <Button
              type="dashed"
              onClick={() => add()}
              icon={<PlusOutlined />}
            >
              Add {label}
            </Button>
            <Form.ErrorList errors={errors} />
          </Form.Item>
        </Form.Item>
      )}
      
    </Form.List>
  );
};