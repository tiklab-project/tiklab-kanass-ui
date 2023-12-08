/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2022-04-11 11:42:02
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2022-04-11 11:42:03
 */
/*
 * @Descripttion: 
 * @version: 1.0.0
 * @Author: 袁婕轩
 * @Date: 2021-04-19 16:47:25
 * @LastEditors: 袁婕轩
 * @LastEditTime: 2021-07-14 15:12:13
 */
const { merge } = require('webpack-merge');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const optimizeCss = require('optimize-css-assets-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const baseWebpackConfig = require('./webpack.base');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;


module.exports = merge(baseWebpackConfig, {
    mode: 'production',
    cache: {
        type: 'filesystem', // 使用文件缓存
    },
    entry: [
        path.resolve(__dirname, './src.js'),
        
    ],
    plugins: [
        new BundleAnalyzerPlugin({analyzerPort: 8880,}),
       
        
        new optimizeCss({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano'),
            cssProcessorOptions: {
                safe: true,
                discardComments: {
                    removeAll: true
                }
            }
        }),
        new ProgressBarPlugin()
    ],
    optimization: {
        minimize: true,
        nodeEnv: process.env.NODE_ENV,
        splitChunks: {
            chunks: "all",
            minSize: 100,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '--', // 分包打包生成文件的名称的连接符
            name:false,
            cacheGroups: { //  cacheGroups 缓存组，如：将某个特定的库打包
                antIcon: {
                    name: 'chunk-antIcon',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]@ant-design[\\/]/,
                    priority: 90,
                    reuseExistingChunk: true
                },
                thoughtwareFormUI: {
                    name: 'chunk-thoughtware-form-ui',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]thoughtware-form-ui[\\/]/,
                    priority: 90,
                    reuseExistingChunk: true
                },
                thoughtwarePrivilegeUI: {
                    name: 'chunk-thoughtware-privilege-ui',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]thoughtware-privilege-ui[\\/]/,
                    priority: 70,
                    minChunks: 1,
                    reuseExistingChunk: true
                },
                thoughtwarePluginUI: {
                    name: 'chunk-thoughtware-plugin-ui',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]thoughtware-plugin-ui[\\/]/,
                    priority: 50,
                    reuseExistingChunk: true
                },
                thoughtwareUserUI: {
                    name: 'chunk-thoughtware-user-ui',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]thoughtware-user-ui[\\/]/,
                    priority: 60,
                    reuseExistingChunk: true
                },
                thoughtwareCoreUI: {
                    name: 'chunk-thoughtware-core-ui',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]thoughtware-core-ui[\\/]/,
                    priority: 50,
                    reuseExistingChunk: true
                },
                thoughtwareMessageUI: {
                    name: 'chunk-thoughtware-message-ui',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]thoughtware-message-ui[\\/]/,
                    priority: 80,
                    reuseExistingChunk: true
                },
                thoughtwareEamUI: {
                    name: 'chunk-thoughtware-eam-ui',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]thoughtware-eam-ui[\\/]/,
                    priority: 50,
                    reuseExistingChunk: true
                },
                thoughtwareSlateUI: {
                    name: 'chunk-thoughtware-slate-ui',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]thoughtware-slate-ui[\\/]/,
                    priority: 100,
                    reuseExistingChunk: false
                },
                mobx: {
                    name: 'chunk-mobx',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]mobx[\\/]/,
                    priority: 80,
                    reuseExistingChunk: true
                },
               
                mobxReact: {
                    name: 'chunk-mobx-react',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]mobx-react[\\/]/,
                    priority: 80,
                    reuseExistingChunk: true
                },
                moment: {
                    name: 'chunk-moment',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]moment[\\/]/,
                    priority: 80,
                    reuseExistingChunk: true
                },
                reactDom: {
                    name: 'chunk-react-dom',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]react-dom[\\/]/,
                    priority: 30,
                    reuseExistingChunk: true
                },
                antv: {
                    name: 'chunk-antv',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]@antv[\\/]/,
                    priority: 90,
                    reuseExistingChunk: true
                },
                provinceCityChina: {
                    name: 'chunk-province-city-china',
                    chunks: 'all',
                    test: /[\\/]node_modules[\\/]@province-city-china[\\/]/,
                    priority: 60,
                    reuseExistingChunk: true
                },
                echarts: {
                    name: 'chunk-echarts',
                    chunks: 'all',
                    test: /[\\/]echarts[\\/]/,
                    priority: 80,
                    reuseExistingChunk: true
                },
                antdUI: {
                    name: 'chunk-antdUI',
                    chunks: 'async',
                    test: /[\\/]node_modules[\\/]antd[\\/]/,
                    priority: 150,
                    reuseExistingChunk: true
                },
                icon: {
                    name: 'chunk-icon',
                    chunks: 'all',
                    test: /[\\/]src[\\/]font-icon[\\/]/,
                    priority: 90,
                    reuseExistingChunk: true
                },
                rcomponent: {
                    name: "chunk-rcomponent",
                    chunks: "all",
                    test: /rc-[a-zA-Z]/,
                    priority: 1,
                    reuseExistingChunk: true
                },
                vendors:{//node_modules里的代码
                    test:/[\\/]node_modules[\\/]/,
                    chunks: "initial",
                    name:'vendors', //chunks name
                    priority:10, //优先级
                    enforce:true 
                },
                /* 提取共用部分，一下提取的部分会议commons 命名 */
                commons: {
                    name: 'commons',
                    test: function (module, chunks) {
                        if (/react/.test(module.context)) {
                            return true
                        }
                    },
                    chunks: 'all',
                    minChunks: 2, //  提取公共部分最少的文件数
                    // minportal: 0 // 提取公共部分最小的大小
                    // enforce: true
                }
            }
        },
        usedExports: true,
        minimizer: [
            new TerserPlugin({  // 压缩js
                cache: true,
                parallel: true,
                terserOptions: {
                    compress: {
                        drop_console: true,
                        drop_debugger: true // 去除console.log 和debuger
                    },
                }
            })
        ]
    }
});
