import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Spin } from 'antd';
import './index.less';

const container = document.createElement('Gmask');
let GMaskCount = [];
class GMask extends PureComponent {
  static mask = (params) => {
    document.body.appendChild(container);
    GMaskCount.push(<GMask key={GMaskCount.length} {...params}/>);
    ReactDOM.render(
      GMaskCount,
      container,
    );
  };

  static unmask = () => {
    ReactDOM.unmountComponentAtNode(container);
    GMaskCount.pop();
    if (!GMaskCount.length) {
      ReactDOM.unmountComponentAtNode(container);
      document.body.removeChild(container);
    }
  };

  render() {
    return (
      <div className="global-mask">
        <div className="mask"></div>
        <Spin size="large" />
      </div>
    );
  }
}

GMask.propTypes = {
 
};

export default GMask;
