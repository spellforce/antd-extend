import React from 'react';
import { Typography, Tooltip } from 'antd';
import './index.less';

const isJsonString = (str: any) => {
  try {
    if (typeof JSON.parse(str) == 'object') {
      return true;
    }
  } catch (e) {}
  return false;
};

const isJsonObject = (data: any) => {
  try {
    if (typeof data == 'object' && typeof JSON.stringify(data) == 'string') {
      if (data instanceof Array) {
        if (data.length && typeof data[0] == 'string') {
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

interface Props {
  children?: any;
  /**
   * @description 样式Class
   */
  className?: any;
  /**
   * @description 显示行数
   * @default 1
   */
  rows?: number;
  /**
   * @description 显示宽度
   * @default 280
   */
  width?: any;
}

// const innerDimensions = (node) => {
//   var computedStyle = getComputedStyle(node)

//   let width = node.clientWidth // width with padding
//   let height = node.clientHeight // height with padding

//   height -= parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom)
//   width -= parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight)
//   return { height, width }
// }

const LongText = (props: Props) => {
  // const ref: any = useRef();
  const { children, className, rows = 1, width } = props;
  let text: any;
  let result = children;

  // useEffect(() => {
  //   if (ref.current && ref.current.parentNode) {
  //     console.dir(ref.current.closest("table").closest("colgroup"))
  //     console.dir(ref.current.parentNode)
  //   }
  // }, []);

  if (React.isValidElement(children)) {
    text = children;
  } else if (isJsonString(children)) {
    text = <pre>{JSON.stringify(JSON.parse(children), null, 2)}</pre>;
  } else if (isJsonObject(children)) {
    text = <pre>{JSON.stringify(children, null, 2)}</pre>;
    result = JSON.stringify(children);
  } else if (children instanceof Array) {
    text = (
      <div className="break-word">
        {children.map((v) => (
          <span key={v}>
            {v}
            <br />
          </span>
        ))}
      </div>
    );
    result = children.join(', ');
  } else {
    text = children;
  }

  return rows > 1 ? (
    <Typography.Paragraph
      style={width && { width }}
      ellipsis={{ rows, tooltip: <div className="long-text-content">{text}</div> }}
      className={className}
    >
      {result}
    </Typography.Paragraph>
  ) : (
    <Tooltip
      title={
        <div className="long-text-content" style={width && { minWidth: width / 3 }}>
          {text}
        </div>
      }
    >
      <Typography.Text style={width && { width }} ellipsis={true} className={className}>
        {result}
      </Typography.Text>
    </Tooltip>
  );
};

LongText.defaultProps = {
  rows: '1',
};

export default LongText;
