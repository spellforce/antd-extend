/* eslint-disable */
import React from 'react';
import { Menu, MenuProps } from 'antd';
import { parse } from '../Utils';

const { SubMenu } = Menu;

export type DataProps = {
  key: string;
  label?: string;
  [x: string]: any;
  children: Array<DataProps>;
};

// interface MenuInfo {
//   key: string;
//   keyPath: string[];
//   /** @deprecated This will not support in future. You should avoid to use this */
//   item: React.ReactInstance;
//   domEvent: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>;
// }

interface SelectInfo {
  item: DataProps;
  key: string;
}

export declare type SelectEventHandler = (info: SelectInfo) => void;

interface Props extends Omit<MenuProps, 'onSelect'> {
  /**
   * 可以这样写属性描述
   * @description
   * @description.zh-CN 传[{key, tile, children}] 类型的数据
   * @default []
   */
  data: Array<DataProps>;
  /**
   * @description
   * @description.zh-CN 传[{key, tile, children}] 类型的数据
   * @default key
   */
  keyName: string;
  onSelect: any;
}

// input data
// [{
//   key: 'a',
//   label: 'b', optional, label
//   children: [{
//     key: 'a',
//     label: 'b',
//     children: [{
//       ....
//     }]
//   }]
// }]

// function findIndex(valueToSearch, theArray, currentIndex) {
//   if (currentIndex == undefined) currentIndex = "";

//   for (var i = 0; i < theArray.length; i++) {
//     if (Array.isArray(theArray[i])) {
//       const newIndex = findIndex(valueToSearch, theArray[i], currentIndex + i + ",");
//       if (newIndex) return newIndex;
//     } else if (theArray[i] == valueToSearch) {
//       return currentIndex + i;
//     }
//   }

//   return false;
// }

// var a = new Array();
// a[0] = new Array(1, 2, 3, 4, 5);
// a[1] = "ciao";
// a[2] = new Array(new Array(6, 7), new Array(8, 9), 10);

// var specificIndex = findIndex("8", a);

// console.log(a,specificIndex)

const getOptionKeys = (data, key, result = '', deep = 0) => {
  if (deep > 4) {
    return false;
  }
  if (data.length) {
    for (let i in data) {
      if (data[i]['children'] && data[i]['children'].length) {
        const newIndex = getOptionKeys(
          data[i]['children'],
          key,
          result + data[i]['key'] + ',',
          deep + 1,
        );
        if (newIndex) return newIndex;
      } else {
        if (data[i]['key'] === key) {
          return result.substring(0, result.length - 1);
        }
      }
    }
  } else {
    return result;
  }

  return false;
};

const getDataByKey = (data, key, deep = 0) => {
  if (deep > 4) {
    return false;
  }
  // console.log("getDataByKey", "data", data, "key", key)
  if (data.length) {
    for (let i in data) {
      if (data[i]['children'] && data[i]['children'].length) {
        const result = getDataByKey(data[i]['children'], key, deep + 1);
        if (result) return result;
      } else {
        // console.log(data[i]["key"], key, data[i]["key"] === key)
        if (data[i]['key'] === key) {
          return data[i];
        }
      }
    }
  }

  return false;
};

const getFirstData = (data) => {
  const first = data[0];
  if (first.children && first.children.length) {
    return getFirstData(first.children);
  } else {
    return first;
  }
};

const setBrowserUrl = (queryProps) => {
  let url = location.pathname;
  const parsed = parse(location.search);
  const params = { ...parsed, ...queryProps };

  let j = 0;
  for (let i in params) {
    url += j === 0 ? '?' : '&';
    url += encodeURIComponent(i) + '=' + encodeURIComponent(params[i]);
    j++;
  }

  history.pushState({ url: url }, '', url);
};

const DeepMenu = (props: Props) => {
  const parsed = parse(location.search);
  const { data, openKeys, defaultSelectedKeys, selectedKeys, keyName, ...rest } = props;
  const [inOpenKeys, setOpenKeys] = React.useState(openKeys);
  const preSelectedKeys = [parsed[keyName]];
  // if selectedKeys is present, keys controled by outside.
  const [inSelectedKeys, setSelectedKeys]: any = React.useState(
    selectedKeys || defaultSelectedKeys || preSelectedKeys,
  );
  // const isInitialMount = useRef(true);

  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    if (inSelectedKeys && inSelectedKeys.length && inSelectedKeys[0] !== undefined) {
      const seleted = getDataByKey(data, inSelectedKeys[0]);
      console.log('selected', seleted, data, inSelectedKeys);
      setBrowserUrl({ [keyName]: seleted.key });
      if (seleted) rest.onSelect && rest.onSelect({ item: seleted, key: seleted.key });
    }
  }, [JSON.stringify(inSelectedKeys)]);

  React.useEffect(() => {
    let temp;
    if (inSelectedKeys && inSelectedKeys.length && inSelectedKeys[0] !== undefined) {
      temp = inSelectedKeys;
    } else if (data.length) {
      const first = getFirstData(data);
      // console.log("first", first);
      temp = [first.key];
    }

    if (temp) {
      setSelectedKeys(temp);
      const keys = getOptionKeys(data, temp[0]);
      keys && setOpenKeys(keys.split(','));
    }
  }, [JSON.stringify(inSelectedKeys)]);

  React.useEffect(() => {
    if (selectedKeys && selectedKeys.length && selectedKeys[0] !== undefined) {
      setSelectedKeys(selectedKeys);
      const keys = getOptionKeys(data, selectedKeys[0]);
      keys && setOpenKeys(keys.split(','));
    }
  }, [JSON.stringify(selectedKeys)]);

  // React.useEffect(() => {
  //   if (openKeys && openKeys.length) {
  //     setOpenKeys(openKeys);
  //   }
  // }, [JSON.stringify(openKeys)]);

  const getMenu = (data) => {
    return data.map((n) => {
      const { children, key, label, ...rest } = n;
      return children && children.length ? (
        <SubMenu key={key} title={label || key} {...rest}>
          {getMenu(children)}
        </SubMenu>
      ) : (
        <Menu.Item key={key} self={n} {...rest}>
          {label || key}
        </Menu.Item>
      );
    });
  };

  const onOpenChange = (keys) => {
    setOpenKeys(keys);
    rest.onOpenChange && rest.onOpenChange(keys);
  };

  const select = (props) => {
    setSelectedKeys(props.selectedKeys);
  };

  return (
    <Menu
      {...rest}
      openKeys={inOpenKeys}
      selectedKeys={inSelectedKeys}
      onOpenChange={onOpenChange}
      onSelect={select}
    >
      {getMenu(data)}
    </Menu>
  );
};

DeepMenu.defaultProps = {
  data: [],
  keyName: 'key',
};

export default DeepMenu;
