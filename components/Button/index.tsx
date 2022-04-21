import React, { useState } from 'react';
import { Button as AntdButton, ButtonProps, Tooltip } from 'antd';
import './index.less';

interface Props extends ButtonProps {
  onClick?: any;
}

/**
 * Button 组件
 * @link [antd button](https://ant.design/components/button-cn/)
 */

function Button(props: Props) {
  const [loading, setLoading] = useState(false);
  const { onClick, title, className, ...rest } = props;
  const handleClick = async () => {
    if (!onClick) return;
    if (loading) return;
    setLoading(true);
    try {
      await onClick();
    } finally {
      setLoading(false);
    }
  };

  const Base = <AntdButton {...rest} loading={loading} onClick={handleClick} className={`${props.className} custom-button`} />;

  return title ? (
    <Tooltip title={title}>{Base}</Tooltip>
  ) : Base;
}

Button.defaultProps = {
  type: 'primary',
  size: 'small',
};

export default Button;
