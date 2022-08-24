
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const MiniCssExtractPlugin = require('mini-css-extract-plugin');//压缩css
const path = require('path');

const DIST_PATH = path.resolve(__dirname, 'dist');

const envData_dev = require(`./enviroment/enviroment_${process.env.API_ENV}`);
const { SourceMapDevToolPlugin } = require("webpack");
const { merge } = require('webpack-merge');

const sassRegex = /\.(scss|sass)$/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

module.exports = {
    output: {
        filename: 'mobilejs/[name].[hash:8].js',
        chunkFilename: 'mobilejs/[name].[hash:8].js',
        path: DIST_PATH,
        publicPath: '/',
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias: {
            'react-dom': '@hot-loader/react-dom',
            react: path.resolve('./node_modules/react')
        },
    },
    target: "web",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [{
                    // loader: "happypack/loader?id=portal"
                    loader: 'babel-loader'
                }],
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)/,
                exclude: [path.resolve(__dirname, "./src/assets/svg")],
                // exclude: /node_modules/,
                use: {
                    loader: 'url-loader',
                    options: {
                        // publicPath: 'images',
                        outputPath: 'images/',
                        name: '[name].[ext]', // 图片输出的路径
                        limit: 8 * 1024,
                    }
                }
            },
            {
                test: /\.(eot|woff2?|ttf|svg)$/,
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
                exclude: /node_modules/,
                include: [path.resolve(__dirname,'./src/assets/svg')],
                use: [
                    { loader: 'svg-sprite-loader', options: {symbolId: 'icon-[name]'} },
                    { loader: 'svgo-loader', options: {} },
                ]
            },
            {
                test: /\.(sc|sa|c)ss$/,
                exclude: sassModuleRegex,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                    },
                    {
                        loader: "css-loader",
                    },
                    {
                        loader: "postcss-loader"
                    },
                    {
                        loader: "sass-loader",
                    },
                    {
                        loader: 'sass-resources-loader',
                        options: {
                            resources: './src/index.scss'
                        }
                    }
                ],
            },

            {
                test: sassModuleRegex,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 3,
                            modules: {
                                localIdentName: '[local]--[hash:base64:5]',
                            },
                        },
                    },
                    {
                        loader: 'postcss-loader',
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                        },
                    }
                ],
            },
        ]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            alwaysWriteToDisk: true,
            title: '项目管理',
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
        // new webpack.DefinePlugin(devMode ? envData_dev : envData_prod),
        new webpack.DefinePlugin(envData_dev),
        new MiniCssExtractPlugin({
            filename: 'mobilecss/[name].css',
            chunkFilename: 'mobilecss/[id].css',
            ignoreOrder: true
        }),
        new CssMinimizerPlugin(),
        // new CheckVersion()
    ]
};
