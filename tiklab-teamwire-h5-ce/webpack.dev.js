/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2020-12-18 16:04:03
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-03-24 10:35:06
 */

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.base');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin  = require('terser-webpack-plugin');

const PORT = 3005;

module.exports = merge(baseWebpackConfig, {
    devtool: 'source-map',
    mode:'development',
    entry: [
        'react-hot-loader/patch',
        `webpack-dev-server/client?http://127.0.0.1:${PORT}/`,
        path.resolve(__dirname, './src/index.js')
    ],
    optimization:{
        namedModules: true,
        namedChunks: true,
        runtimeChunk: {
            name: 'runtime'
        },
        minimize: false,
        minimizer: [new TerserPlugin()],
        splitChunks:
            {
                name: false,
                chunks: 'all',
                // minportal: 1,
                minChunks: 1,
                cacheGroups:
                    {
                        default: false,
                        vendors:
                            {
                                name: 'common',
                                chunks: 'all',
                                minChunks: 2,
                                test: /node_modules/
                            },
                        styles:
                            {
                                name: 'common',
                                chunks: 'all',
                                minChunks: 2,
                                test: /\.(css|less|scss|stylus)$/,
                                enforce: true,
                                priority: 50
                            }
                    }
            }
    },

    devServer: {
        contentBase: path.join(__dirname, 'plugin'), //开发服务运行时的文件根目录
        port:PORT,
        historyApiFallback: true,
        inline: true,
        hot: true,
        host: '0.0.0.0',
        hotOnly:true,
        disableHostCheck: true,
        stats: {
            children: false,
        },
        // proxy: {
        //     '/': {
        //         target: 'http://www.dev.project.tiklab.net/',//代理地址，这里设置的地址会代替axios中设置的baseURL
        //         changeOrigin: true,// 如果接口跨域，需要进行这个参数配置
        //         //ws: true, // proxy websockets
        //         //pathRewrite方法重写url
        //         pathRewrite: {
        //             '^/': '/'
        //             //pathRewrite: {'^/api': '/'} 重写之后url为 http://192.168.1.16:8085/xxxx
        //             //pathRewrite: {'^/api': '/api'} 重写之后url为 http://192.168.1.16:8085/api/xxxx
        //         }
        //     }
        // }
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ]
});
