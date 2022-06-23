---
nav:
  path: /components
# group:
#   path: /components
#   title: Components
---

## Modal

Modal 的用法改成了 Javascript 调用

```tsx
/**
 * title: 同步数据用法
 * desc: 直接给数据源
 */
import React, { useState } from 'react';
import { Button, Space } from 'antd';
import { Modal } from 'antd-extend-zx';

export default () => {
  const [content, setContent] = useState();

  const onClickWithFooter = () => {
    Modal.create({
      title: 'Show Content',
      children: <div>This is content</div>,
      footer: (onClose) => (
        <Button key="back" onClick={onClose}>
          Close
        </Button>
      ),
    });
  };

  const onClick = () => {
    Modal.create({
      title: 'Show Content',
      children: <div>This is content</div>,
    });
  };

  return (
    <Space>
      <Button onClick={onClick}>Create Modal</Button>
      <Button onClick={onClickWithFooter}>Create Modal with footer</Button>
    </Space>
  );
};
```

```tsx
/**
 * title: 其他属性和antd modal 一致
 * desc: https://ant.design/components/modal-cn
 */
import { Button, Modal, Space } from 'antd';
import React, { createContext } from 'react';

const ReachableContext = createContext<string | null>(null);
const UnreachableContext = createContext<string | null>(null);

const config = {
  title: 'Use Hook!',
  content: (
    <>
      <ReachableContext.Consumer>{(name) => `Reachable: ${name}!`}</ReachableContext.Consumer>
      <br />
      <UnreachableContext.Consumer>{(name) => `Unreachable: ${name}!`}</UnreachableContext.Consumer>
    </>
  ),
};

const App: React.FC = () => {
  const [modal, contextHolder] = Modal.useModal();

  return (
    <ReachableContext.Provider value="Light">
      <Space>
        <Button
          onClick={() => {
            modal.confirm(config);
          }}
        >
          Confirm
        </Button>
        <Button
          onClick={() => {
            modal.warning(config);
          }}
        >
          Warning
        </Button>
        <Button
          onClick={() => {
            modal.info(config);
          }}
        >
          Info
        </Button>
        <Button
          onClick={() => {
            modal.error(config);
          }}
        >
          Error
        </Button>
      </Space>
      {/* `contextHolder` should always under the context you want to access */}
      {contextHolder}

      {/* Can not access this context since `contextHolder` is not in it */}
      <UnreachableContext.Provider value="Bamboo" />
    </ReachableContext.Provider>
  );
};

export default App;
```

<API></API>

其他属性与 antd Menu 一致：https://ant.design/components/menu-cn/#API
