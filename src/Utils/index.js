import _ from 'lodash';
// const env = process.env.NODE_ENV;

// export const getPlainNode = (nodeList, parentPath = "") => {
//   const arr = [];
//   nodeList.forEach(node => {
//     const item = node;
//     item.path = `${parentPath}/${item.path || ""}`.replace(/\/+/g, "/");
//     item.exact = true;
//     if (item.children && !item.component) {
//       arr.push(...getPlainNode(item.children, item.path));
//     } else {
//       if (item.children && item.component) {
//         item.exact = false;
//       }
//       arr.push(item);
//     }
//   });
//   return arr;
// };

// export const getCookie = name => {
//   const reg = new RegExp(`(^| )${name}=([^;]*)(;|$)`);
//   let arr = document.cookie.match(reg);
//   if (arr) {
//     return unescape(arr[2]);
//   }
//   return null;
// };

// /* eslint-disable */
// export const setCookie = (name, value, options = {}) => {
//   let { path, time, sameSite, httpOnly, domain } = options;
//   path = path || "/";
//   // time is day time
//   time = time || 30;
//   sameSite = sameSite || env !== "development";
//   domain = domain || (env === "development" ? "localhost" : "gridx.ws");
//   httpOnly = httpOnly || true;
//   const exp = new Date();
//   exp.setTime(exp.getTime() + time * 24 * 60 * 60 * 1000);
//   document.cookie = `${name}=${escape(
//     value
//   )};expires=${exp.toGMTString()};path=${path};sameSite=${sameSite};domain=${domain}`;
// };

// export const delCookie = name => {
//   setCookie(name, "", { time: -1 });
// };

export const isJsonString = (str) => {
  try {
    if (typeof JSON.parse(str) == 'object') {
      return true;
    }
  } catch (e) {}
  return false;
};

export const isJsonObject = (data) => {
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

export const stringSorter = (a, b) => {
  a || (a = '');
  b || (b = '');
  const stringA = a.toUpperCase(); // ignore upper and lowercase
  const stringB = b.toUpperCase(); // ignore upper and lowercase
  if (stringA < stringB) {
    return -1;
  }
  if (stringA > stringB) {
    return 1;
  }
  // names must be equal
  return 0;
};

export function generateColTitle(columns) {
  for (const i in columns) {
    if (!columns[i].title) {
      columns[i].title = toHump(_.capitalize(columns[i].dataIndex), ' ').replace('Id', 'ID');
    }
  }

  return columns;
}

export function parse(querystring) {
  var ret = {};
  var reg = /([^&]*)=([^&]*)/g;
  var matches;

  while ((matches = reg.exec(querystring))) {
    var key = matches[1];
    var val = matches[2];

    // 如果是多值
    if (ret[key]) {
      ret[key] = Array.isArray(ret[key]) ? ret[key] : [ret[key]];
      ret[key].push(val);
    } else {
      ret[key] = val;
    }
  }

  return ret;
}

export function generateTitle(dataIndex) {
  return toHump(_.capitalize(dataIndex), ' ').replace('Id', 'ID');
}

export function toHumpTitle(name) {
  return toHump(name, ' ', true);
}

export function toHump(name, replace = '', isFirstLetterCapitalized = false) {
  if (isFirstLetterCapitalized && name) {
    name = name.replace(name[0], name[0].toUpperCase());
  }
  return name.replace(/_(\w)/g, (all, letter) => {
    return replace + letter.toUpperCase();
  });
}

export function toLine(name) {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase();
}
