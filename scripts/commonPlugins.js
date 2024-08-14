/**
 * @name: commonPlugins
 * @author mahai
 * @date 2022/7/8 2:27 PM
 * @description commonPlugins
 */
import { nodeResolve } from '@rollup/plugin-node-resolve';
import peerDepsExternal from "rollup-plugin-peer-deps-external";
// rollup 的 babel 插件，ES6转ES5
import babel from '@rollup/plugin-babel';
// 替换待打包文件里的一些变量，如 process在浏览器端是不存在的，需要被替换
import replace from '@rollup/plugin-replace'
// 将非ES6语法的包转为ES6可用
import commonjs from '@rollup/plugin-commonjs';

import postcss from "rollup-plugin-postcss";
// 可以将.json文件转为es6模块供rollup处理
import json from '@rollup/plugin-json';

import {NODE_ENV} from './constant';

import image from '@rollup/plugin-image';

import copy from 'rollup-plugin-copy';

import url from '@rollup/plugin-url';

const extensions = ['.js', '.jsx']

const commonPlugins = [
    peerDepsExternal(),
    nodeResolve({
        extensions
    }),
    babel({
        babelHelpers: 'inline',
        exclude: /^(.+\/)?node_modules\/.+$/
    }),
    commonjs(),
    json(),
    postcss(),
    replace({
        exclude: 'node_modules/**',
        'process.env.NODE_ENV': JSON.stringify(NODE_ENV),
        preventAssignment:true,
    }),
    url({
        include: ['**/*.svg', '**/*.png', '**/*.jpg'],
        limit: 0,
        fileName: '[name][extname]',
        destDir: 'es/src/assets/images',
        publicPath: '/images/'
    }),
    // copy({
    //     targets: [
    //       { src: 'src/assets/*', dest: 'es/src/assets' },
    //       // 添加其他图片格式的配置
    //     ],
    //     flatten: false, // 设置为true时，只拷贝文件，不复制目录结构
    // }),
];

export default commonPlugins;
