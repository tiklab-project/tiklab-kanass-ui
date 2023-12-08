
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');//压缩css
const path = require('path');

const DIST_PATH = path.resolve(__dirname, 'prod');

const envData_dev = require(`./enviroment/enviroment_${process.env.API_ENV}`);
const sassModuleRegex = /\.module\.(scss|sass)$/;
const isDevelopment = process.env.NODE_ENV !== "prod";

module.exports = {
    output: {
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[hash:8].js',
        path: DIST_PATH,
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            'react-dom': '@hot-loader/react-dom',
            react: path.resolve('./node_modules/react'),
            '@common': path.resolve("./src/common")
        },
    },
    target: "web",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: [
                    'thread-loader',
                    'babel-loader'
                ]
                
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)/,
                // exclude: /node_modules/,
                exclude: [path.resolve(__dirname, "./src/assets/svg"), /\.(png|jpg|jpeg|gif).js/],
                use: {
                    loader: 'url-loader',
                    options: {
                        // publicPath: 'images',
                        outputPath: 'images/',
                        name: '[name].[ext]', // 图片输出的路径
                        limit: 0,
                    }
                }
            },
            {
                test: /\.(eot|woff2?|ttf)$/,
                exclude: [path.resolve(__dirname, "./src/assets/svg")],
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            name: '[name]-[hash:5].min.[ext]',
                            limit: 5000, // fonts file portal <= 5KB, use 'base64'; else, output svg file
                            outputPath: 'fonts/',
                        }
                    }
                ]
            },
            {
                test: /\.svg$/,
                exclude: [/node_modules/],
                include: [path.resolve(__dirname, './src/assets/svg')],
                use: [
                    { loader: 'svg-sprite-loader', options: { symbolId: 'icon-[name]' } },
                    { loader: 'svgo-loader', options: {} },
                ]
            },
            
            {
                test: /\.(sc|sa|c)ss$/,
                exclude: sassModuleRegex,
                use: [
                    "style-loader",
                    {
                        loader: "css-loader",
                        // options: {
                        //     sourceMap: isDevelopment ? true : false
                        // },

                    },
                    {
                        loader: "postcss-loader"
                    },
                    {
                        loader: "sass-loader"
                    },
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: './src/index.scss'
                        }
                    },
                   
                ],
            },
            {
                test: sassModuleRegex,
                use: [
                    "style-loader",
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 3,
                            modules: {
                                localIdentName: '[local]--[hash:base64:5]',
                            },
                            // sourceMap: isDevelopment ? true : false
                        },
                    },
                    {
                        loader: 'postcss-loader'
                    },
                    {
                        loader: 'sass-loader'
                    }
                ],
                sideEffects: true
            }
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        // new HappyPack({
        //     id: 'js',
        //     loaders: [{
        //         loader: 'babel-loader',
        //         options: {
        //             babelrc: true, cacheDirectory: true
        //         }
        //     }]    
        // }),
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/),
        new HtmlWebpackPlugin({
            alwaysWriteToDisk: true,
            title: 'Kanass',
            template: path.resolve(__dirname, './public/index.template.html'),
            hash: false,
            filename: 'index.html',
            inject: 'body',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
                removeAttributeQuotes: true
            }
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash].css',
            chunkFilename: 'css/[id].[contenthash].css',
            ignoreOrder: true
        }),
        new CssMinimizerPlugin(),
        new webpack.DefinePlugin(envData_dev)

    ]
};
