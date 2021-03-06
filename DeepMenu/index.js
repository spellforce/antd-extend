/* eslint-disable no-restricted-globals */
import React from "react";
import { Menu } from "antd";

const { SubMenu } = Menu;

// input data
// [{
//   key: 'a',
//   title: 'b', optional, title
//   children: [{
//     key: 'a',
//     title: 'b',
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

const getOptionKeys = (data, key, result = "", deep = 0) => {
  if (deep > 4) {
    return false;
  }
  if (data.length) {
    for (let i in data) {
      if (data[i]["children"] && data[i]["children"].length) {
        const newIndex = getOptionKeys(data[i]["children"], key, result + data[i]["key"] + ",", deep + 1);
        if (newIndex) return newIndex;
      } else {
        if (data[i]["key"] === key) {
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
  if (data.length) {
    for (let i in data) {
      if (data[i]["children"] && data[i]["children"].length) {
        const result = getDataByKey(data[i]["children"], key, deep + 1);
        if (result) return result;
      } else {
        if (data[i]["key"] === key) {
          return data[i]
        }
      }
    }
  }

  return false;
}

const getFirstData = data => {
  const first = data[0];
  if (first.children && first.children.length) {
    return getFirstData(first.children);
  } else {
    return first;
  }
};

const setBrowserUrl = queryObj => {
  var url = `${location.pathname}?${queryObj}`;
  history.pushState({ url: url }, "", url);
};

export default ({ data, openKeys, defaultSelectedKeys, selectedKeys, ...rest }) => {
  const [inOpenKeys, setOpenKeys] = React.useState(openKeys);
  // if selectedKeys is present, keys controled by outside.
  const [inSelectedKeys, setSelectedKeys] = React.useState(selectedKeys || defaultSelectedKeys);
  // const isInitialMount = useRef(true);

  /* eslint-disable react-hooks/exhaustive-deps */
  React.useEffect(() => {
    if (inSelectedKeys && inSelectedKeys.length && inSelectedKeys[0] !== undefined) {
      const seleted = getDataByKey(data, inSelectedKeys[0]);
      setBrowserUrl(`key=${seleted.key}`);
      rest.onSelect && rest.onSelect({ item: seleted, key: seleted.key });
    }
  }, [JSON.stringify(inSelectedKeys)]);

  React.useEffect(() => {
    let temp;
    if (inSelectedKeys && inSelectedKeys.length && inSelectedKeys[0] !== undefined) {
      temp = inSelectedKeys;
    } else if (data.length) {
      const first = getFirstData(data);
      temp = [first.key];
    }

    if (temp) {
      setSelectedKeys(temp);
      const keys = getOptionKeys(data, temp[0]);
      keys && setOpenKeys(keys.split(","));
    }
  }, [JSON.stringify(inSelectedKeys)]);

  React.useEffect(() => {
    if (selectedKeys && selectedKeys.length && selectedKeys[0] !== undefined) {
      setSelectedKeys(selectedKeys);
      const keys = getOptionKeys(data, selectedKeys[0]);
      keys && setOpenKeys(keys.split(","));
    }
  }, [JSON.stringify(selectedKeys)]);

  // React.useEffect(() => {
  //   if (openKeys && openKeys.length) {
  //     setOpenKeys(openKeys);
  //   }
  // }, [JSON.stringify(openKeys)]);

  const getMenu = data => {
    return data.map(n => {
      const { children, key, title, ...rest } = n;
      return children && children.length ? (
        <SubMenu key={key} title={title || key} {...rest}>
          {getMenu(children)}
        </SubMenu>
      ) : (
        <Menu.Item key={key} self={n} {...rest}>
          {title || key}
        </Menu.Item>
      );
    });
  };

  const onOpenChange = keys => {
    setOpenKeys(keys);
    rest.onOpenChange && rest.onOpenChange(keys);
  };

  const select = props => {
    setSelectedKeys(props.selectedKeys);
  };

  return (
    <Menu {...rest} openKeys={inOpenKeys} selectedKeys={inSelectedKeys} onOpenChange={onOpenChange} onSelect={select}>
      {getMenu(data)}
    </Menu>
  );
};
