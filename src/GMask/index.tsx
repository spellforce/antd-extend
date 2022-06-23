import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Spin } from 'antd';
import './index.less';

const container = document.createElement('Gmask');
let GMaskCount: any = [];

let Mask = <Spin size="large" />;

interface Props {
  mask?: Function;
  unmask?: Function;
  setMask?: Function;
  key?: string | number;
}

class GMask extends PureComponent implements Props {
  key: 0;
  static mask = (params) => {
    document.body.appendChild(container);
    GMaskCount.push(<GMask key={GMaskCount.length} {...params} />);
    ReactDOM.render(GMaskCount, container);
  };

  static unmask = () => {
    GMaskCount.pop();
    if (!GMaskCount.length) {
      ReactDOM.unmountComponentAtNode(container);
      document.body.removeChild(container);
    }
  };

  static setMask = (mask: JSX.Element) => {
    Mask = mask;
  };

  render() {
    return (
      <div className="global-mask">
        <div className="mask"></div>
        {Mask}
      </div>
    );
  }
}

export default GMask;
