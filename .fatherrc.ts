export default {
  cjs: {
    type: 'rollup',
    minify: true,
  },
  // lessInRollupMode: {},
  // cssModules: {
  //   generateScopedName: 'foo-bar_[name]__[local]___[hash:base64:5]',
  // },
  extraBabelPlugins: [
    [
      'babel-plugin-import',
      {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
      },
    ],
  ],
};
