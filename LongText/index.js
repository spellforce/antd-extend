import React from "react";
import { Typography, Tooltip } from "antd";
import "./index.less";

const isJsonString = str => {
  try {
    if (typeof JSON.parse(str) == "object") {
      return true;
    }
  } catch (e) {}
  return false;
};

const isJsonObject = data => {
  try {
    if (typeof data == "object" && typeof JSON.stringify(data) == "string") {
      if (data instanceof Array) {
        if (data.length && typeof data[0] == "string") {
          return false;
        }
        if (data.length === 0) {
          return false;
        }
      }
      return true;
    }
  } catch (e) {}
  return false;
};

export default props => {
  const { children, className, rows = 1, width = 280 } = props;
  let text;
  let result = children;
  
  if (React.isValidElement(children)) {
    text = children;
  } else if (isJsonString(children)) {
    text = <pre>{JSON.stringify(JSON.parse(children), null, 2)}</pre>;
  } else if (isJsonObject(children)) {
    text = <pre>{JSON.stringify(children, null, 2)}</pre>;
    result = JSON.stringify(children);
  } else if (children instanceof Array) {
    text = <div className="break-word">{children.map(v => (<span key={v}>{v}<br /></span>))}</div>;
    result = children.join(", ");
  } else {
    text = children;
  }

  return rows > 1 ? (
    <Typography.Paragraph style={{ width }} ellipsis={{ rows, tooltip: text }} className={className}>
      {result}
    </Typography.Paragraph>
  ) : (
    <Tooltip title={<div className="long-text-content" style={{ minWidth: width / 3 }}>{text}</div>}>
      <Typography.Text style={{ width }} ellipsis={true} className={className}>
          {result}
      </Typography.Text>
     </Tooltip>
  );
};
