import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import postcss from 'rollup-plugin-postcss';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';
import { DEFAULT_EXTENSIONS } from '@babel/core';

const isProd = process.env.NODE_ENV === 'production';

const pkg = require('./package.json');

const dependencies = Object.keys(pkg.peerDependencies);

export default {
  input: './components/index.ts', // 入口文件
  output: [
    {
      format: 'umd',
      name: pkg.name,
      file: 'lib/index.main.js',
      globals: {
        antd: 'antd',
        react: 'react',
        'react-dom': 'react-dom',
      },
    },
    {
      format: 'es',
      name: pkg.name,
      file: 'lib/index.module.js',
      globals: {
        antd: 'antd',
        react: 'react',
        'react-dom': 'react-dom',
      },
    },
  ],
  onwarn: function (warning) {
    if (warning.code === 'CIRCULAR_DEPENDENCY') {
      return;
    }
    console.error(`(!) ${warning.message}`);
  },
  plugins: [
    typescript({
      include: ['*.ts+(|x)', '**/*.ts+(|x)'],
      exclude: 'node_modules/**',
      typescript: require('typescript'),
    }),
    babel({
      exclude: 'node_modules/**',
      babelHelpers: 'runtime',
      // babel 默认不支持 ts 需要手动添加
      extensions: [...DEFAULT_EXTENSIONS, '.ts', 'tsx'],
    }),
    nodeResolve({
      mainField: ['jsnext:main', 'browser', 'module', 'main'],
      browser: true,
    }),
    // 使得 rollup 支持 commonjs 规范，识别 commonjs 规范的依赖
    commonjs(),
    json(),
    postcss({
      // Minimize CSS, boolean or options for cssnano.
      minimize: isProd,
      // Enable sourceMap.
      sourceMap: !isProd,
      // This plugin will process files ending with these extensions and the extensions supported by custom loaders.
      extensions: ['.less', '.css'],
      use: [['less', { javascriptEnabled: true, modifyVars: { '@primary-color': '#42b983' } }]],
    }),
    isProd && terser(), // 压缩js
  ],
  // 指出应将哪些模块视为外部模块，如 Peer dependencies 中的依赖
  external: dependencies,
};
