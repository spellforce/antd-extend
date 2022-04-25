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
  let lock = false;
  const handleClick = async () => {
    if (!onClick) return;
    if (loading) return;

    // 100 ms 内不播放动画，也可以判断onClick函数是否异步
    setTimeout(() => {
      if(!lock) setLoading(true);
    }, 100);

    try {
      await onClick();
    } finally {
      lock = true;
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
