import axios from 'axios';

export default (url, pageNum, pageSize, options = {}) => {
  options.searches = options.searches || [];
  let searches = [ ...options.searches ];
  if (options.builtInSearchKey && options.builtInSearchValue) {
    searches.push({
      key: options.builtInSearchKey,
      value: options.builtInSearchValue
    });
  }
  const params = {
    pagination: {
      current: pageNum,
      pageSize: pageSize,
    },
    search: searches,
  };
  return axios.post(url, params, { mask: false }).then(data => {
    if (data.total && data.results) {
      return {
        total: data.total,
        results: data.results,
      };
    } else {
      return data;
    }
  });
};