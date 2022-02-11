import React from "react";
import { Button, Tooltip } from "antd";
import PropTypes from "prop-types";
import "./index.less";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";

const TipButton = props =>
  props.title ? (
    <Tooltip title={props.title}>
      <Button size="small" {...props} title="" className={`${props.className} custom-button`} />
    </Tooltip>
  ) : (
    <Button size="small" {...props} title="" className={`${props.className} custom-button`} />
  );

TipButton.Create = props => <TipButton title="New" type="primary" icon={<PlusOutlined />} {...props} />;
TipButton.Add = TipButton.Create;

TipButton.Update = props => <TipButton title="Edit" icon={<EditOutlined />} {...props} />;
TipButton.Edit = TipButton.Update;

TipButton.Delete = props => <TipButton title="Delete" type="danger" icon={<DeleteOutlined />} {...props} />;

export default TipButton;
