import React, { Fragment, useEffect, useReducer, useState } from "react";
import { DatePicker, Col, Form, Input, Select, Row, InputNumber, Button } from "antd";
import moment from "moment";
import "./index.less";
import { DownCircleOutlined, UpCircleOutlined } from "@ant-design/icons";

let hideCount = 0;

const uniquePush = (source, data) => {
  for (const i in source) {
    if (source[i].required === data.required) {
      return false;
    }
  }

  source.push(data);
};

const inputNumberValidator = (rule, value) => {
  let min = rule.min
  let max = rule.max
  const message = rule.message
  if (min != null) min = Number(min)
  if (max != null) max = Number(max)
  try {
    const object = Number(value)
    if (min != null && object < min) throw new Error(message)
    if (max != null && object > max) throw new Error(message)
    if (isNaN(object)) throw new Error(message)
    return Promise.resolve()
  } catch (err) {
    return Promise.reject(err)
  }
}

const getInput = v => {
  const { form, offset, ...itemRest } = v;
  const { type, ...rest } = form;
  return (
    <Form.Item key={`key_${v.name}`} {...itemRest}>
      <Input allowClear {...rest} />
    </Form.Item>
  );
};

const getNumber = v => {
  const { form, offset, ...itemRest } = v;
  const { type, className, ...rest } = form;
  return (
    <Form.Item key={`key_${v.name}`} {...itemRest}>
      <InputNumber className={`full-width ${className || ""}`} allowClear {...rest} />
    </Form.Item>
  );
};

const getInputNumber = v => {
  const { form, offset, rules = [], ...itemRest } = v;
  const { type, className, min, max, ...rest } = form;
  if (min || max) {
    rules.push({
      min,
      max,
      message: `${itemRest.label} must be between ${min} and ${max}`,
      validator: inputNumberValidator
    });
  }
  return (
    <Form.Item key={`key_${v.name}`} {...itemRest} rules={rules}>
      <Input type="number" className={`full-width ${className || ""}`} allowClear {...rest} />
    </Form.Item>
  );
};

const getPassword = v => {
  const { form, offset, ...itemRest } = v;
  const { type, ...rest } = form;
  return (
    <Form.Item key={`key_${v.name}`} {...itemRest}>
      <Input.Password allowClear {...rest} />
    </Form.Item>
  );
};

const getTextArea = v => {
  const { form, offset, ...itemRest } = v;
  const { type, ...rest } = form;
  return (
    <Form.Item key={`key_${v.name}`} {...itemRest}>
      <Input.TextArea allowClear {...rest} />
    </Form.Item>
  );
};

const getSelect = v => {
  const { form, offset, actions, ...itemRest } = v;
  const { type, options, className, ...rest } = form;

  const ops = typeof options === "function" ? options() : options;

  return (
    <Form.Item key={`key_${v.name}`} {...itemRest}>
      <Select
        placeholder="Please select"
        allowClear
        onChange={value => executeAction(value, actions)}
        {...rest}
        className={`full-width ${className || ""}`}
      >
        {ops.map(value =>
          value instanceof Array ? (
            <Select.Option key={value[0]} value={value[0]}>
              {value[1]}
            </Select.Option>
          ) : (
            <Select.Option key={value.toString()} value={value.toString()}>
              {value.toString()}
            </Select.Option>
          )
        )}
      </Select>
    </Form.Item>
  );
};

const getDatepicker = (v, formA) => {
  const { form, offset, initialValue, ...itemRest } = v;
  const { type, format, className, onChange, isFormatValue = true, ...rest } = form;

  const temp = formA.getFieldValue(v.name) || initialValue;

  if (temp) {
    if (isFormatValue) {
      formA.setFieldsValue({
        [v.name]: moment(temp, format),
        [`_hidden[${v.name}]`]: moment(temp).format(format),
      });
    } else {
      formA.setFieldsValue({
        [v.name]: moment(temp, format),
      });
    }
  }

  return (
    <Fragment key={`key_${v.name}`}>
      {isFormatValue && (
        <Form.Item name={`_hidden[${v.name}]`} shouldUpdate hidden>
          <Input />
        </Form.Item>
      )}
      <Form.Item {...itemRest}>
        <DatePicker
          format={format}
          // defaultValue={initialValue ? moment(initialValue, format) : null}
          {...rest}
          className={`full-width ${className || ""}`}
          onChange={(value, dateString) => {
            isFormatValue && formA.setFieldsValue({ [`_hidden[${v.name}]`]: dateString });
            onChange && onChange(value, dateString);
          }}
        />
      </Form.Item>
    </Fragment>
  );
};

const parents = (dom, className, count = 0) => {
  if (count > 50) return null;

  if (dom.parentElement.className === className) {
    return dom.parentElement;
  } else {
    return parents(dom.parentElement, className, count + 1);
  }
};

const executeAction = (value, actions = []) => {
  if (actions.length === 0) return;

  for (let i in actions) {
    if (actions[i].value === value) {
      switch (actions[i]["name"]) {
        case "hide":
          actions[i]["target"].forEach(element => {
            const dom = document.getElementById(`DynamicForm_${element}`);
            if (dom) {
              const parent = parents(dom, "ant-row ant-form-item");

              parent.parentElement.hidden = true;
            } else {
              console.log("element id not found!", element);
            }
          });
          break;
        default:
          break;
      }
    }
  }
};

const FormColumns = ({ columns, span = 12, form, row = true }) => {
 
  const [groupHidden] = useState([]);
  const [, forceUpdate] = useReducer(x => x + 1, 0);
  const reg = new RegExp(/^_hidden\[(\S+)]$/g);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    hideCount = 0;

    const { validateFields } = form;
    form.validateFields = () =>
    validateFields().then(values => {
      for (let i in values) {
        if (typeof values[i] === "string") {
          values[i] = values[i].trim();
        }
        if (i.search(/^_hidden\[(\S+)]$/g) > -1) {
          const index = i.replace(reg, "$1");
          values[index] = values[i];
          delete values[i];
        }
      }
      return values;
    });
  }, []);

  const getNormal = v => {
    const { form: innerForm, ...itemRest } = v;
    // if (typeof form.type !== 'object') {
    //   return '';
    // }
    if (itemRest.shouldUpdate || itemRest.dependencies) {
      if (innerForm.form) {
        return <Form.Item {...itemRest} label={null} name={null}>{() => getItem(innerForm)}</Form.Item>;
      }
      if (typeof innerForm === "function") {
        return <Form.Item {...itemRest}>{() => innerForm()}</Form.Item>;
      }
      return <Form.Item {...itemRest}>{() => innerForm}</Form.Item>;
    } else {
      if (typeof innerForm === "function") {
        return <Form.Item {...itemRest}>{innerForm()}</Form.Item>;
      }
      return <Form.Item {...itemRest}>{innerForm}</Form.Item>;
    }
    
  };

  const getLabel = v => {
    const { label, children } = v;
    if (label) {
      return (
        <Col span={24} key={`col_${label}`} className="no-pandding">
          <fieldset>
            <legend>{label}</legend>
            <Row gutter={[24, 12]}>{children && getItems(children)}</Row>
          </fieldset>
        </Col>
      );
    } else {
      return children && getItems(children);
    }
  };

  const showGroupHidden = count => {
    groupHidden[count] = true;
    hideCount = 0;
    forceUpdate();
  };

  const hideGroupHidden = count => {
    groupHidden[count] = false;
    hideCount = 0;
    forceUpdate();
  };

  const getGroupHidden = v => {
    const count = hideCount;
    hideCount = hideCount + 1;
    groupHidden[count] = groupHidden[count] || false;
    const { children } = v;
    return (
      <Col key={`col_${count}`} className="col" span={24}>
        <Row gutter={12}>
          <Col span={24} className={`advanced ${groupHidden[count] && "hidden"}`}>
            <Button type="link" className="collapse" onClick={() => showGroupHidden(count)}>
              Advanced <DownCircleOutlined />
            </Button>
          </Col>
          <Col span={24} className={`col ${!groupHidden[count] && "hidden"}`}>
            <Row gutter={[24, 12]}>{getItems(children)}</Row>
          </Col>
          <Col span={24} className={`advanced ${!groupHidden[count] && "hidden"}`}>
            <Button type="link" className="collapse" onClick={() => hideGroupHidden(count)}>
              Hide <UpCircleOutlined />
            </Button>
          </Col>
        </Row>
      </Col>
    );
  };

  const getItem = v => {
    if (v.required) {
      v.rules || (v.rules = []);
      const temp = { required: true, message: `${v.label} is required.` };
      if (v.form.type === "input") {
        temp.whitespace = true;
      }
      
      uniquePush(v.rules, temp);
    }
    if (v.form) {
      switch (v.form.type) {
        case "input":
          return getInput(v);
        case "select":
          return getSelect(v);
        case "number":
          return getNumber(v);
        case "inputNumber":
          return getInputNumber(v);
        case "password":
          return getPassword(v);
        case "datepicker":
          return getDatepicker(v, form);
        case "textarea":
          return getTextArea(v);
        case "label":
        case "group":
          return getLabel(v);
        case "groupHidden":
          return getGroupHidden(v);
        case "none":
          return null;
        default:
          return getNormal(v);
      }
    }
  };
  /* eslint-disable */
  const getItems = (cols = columns) => {
    return cols.map(v => {
      if (!v) return;
      
      const col = v.col;
      if (v.form) {
        if (col === null || v.form.type === "group" || v.form.type === "label" || v.form.type === "groupHidden") {
          return getItem(v);
        } else {
          return (
            <Col span={span} {...col} key={v.key || v.name}>
              {getItem(v)}
            </Col>
          );
        }
      } else {
        return v;
      }
    });
  };

  if (row) {
    return (
      <Row gutter={[24, 12]} className="dy-form">
        {getItems()}
      </Row>
    );
  } else {
    return getItems();
  }
};

export default FormColumns;
