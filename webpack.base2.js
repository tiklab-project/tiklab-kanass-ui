const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const DIST_PATH = path.resolve(__dirname, 'dist');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const envData_dev = require(`./enviroment/enviroment_${process.env.API_ENV}`);
const isDevelopment = process.env.NODE_ENV !== "prod";

const sassModuleRegex = /\.module\.(scss|sass)$/;
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)$/;

const getStyleLoaders = (cssOptions, preProcessor) => {
    const loaders = [
        isDevelopment && "style-loader",
        !isDevelopment && {
            loader: MiniCssExtractPlugin.loader,
            options: {
                publicPath: "../",
            },
        },
        {
            loader: "css-loader",
            options: cssOptions,
        },
        {
            loader: "postcss-loader",
            options: {
                sourceMap: !isDevelopment ,
            },
        },
    ].filter(Boolean);

    if (preProcessor) {
        // 默认配置
        let loaderOptions = {
            sourceMap: true,
        };
        loaders.push(
            {
                loader: preProcessor,
                options: loaderOptions,
            },
        );
    }
    return loaders;
};


module.exports = {
    output: {
        filename: 'js/[name].[hash:8].js',
        chunkFilename: 'js/[name].[hash:8].js',
        path: DIST_PATH,
        publicPath: "/",
    },
    resolve: {
        extensions: [".js", ".jsx", ".json"],
        alias: {
            "react-dom": "@hot-loader/react-dom",
            "@src": path.join(__dirname, "./src"),
            "@stores": path.join(__dirname, "./src/stores"),
        },
    },
    target: "web",
    module:{
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: [{
                    // loader: "happypack/loader?id=portal"
                    loader: "babel-loader"
                }],
                exclude: /node_modules/
            },
            {
                test: cssRegex,
                exclude: cssModuleRegex,
                use: getStyleLoaders({
                    importLoaders: 1,
                    sourceMap: !isDevelopment ,
                }),
                sideEffects: true,
            },
            {
                test: cssModuleRegex,
                use: getStyleLoaders({
                    importLoaders: 1,
                    sourceMap: !isDevelopment ,
                    modules: {
                        localIdentName: "[local]--[hash:base64:5]",
                    },
                }),
            },
            {
                test: sassRegex,
                exclude: sassModuleRegex,
                use: getStyleLoaders(
                    {
                        importLoaders: 3,
                        sourceMap: !isDevelopment ,
                    },
                    "sass-loader",
                ),
                sideEffects: true,
            },
            {
                test: sassModuleRegex,
                use: getStyleLoaders(
                    {
                        importLoaders: 3,
                        sourceMap: !isDevelopment ,
                        modules: {
                            localIdentName: "[local]--[hash:base64:5]",
                        },
                    },
                    "sass-loader",
                ),
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
        ]
    },


    plugins: [
        new HtmlWebpackPlugin({
            alwaysWriteToDisk: true,
            title: 'TeamWire',
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

        new webpack.DefinePlugin(envData_dev)
    ]
};
