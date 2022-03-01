const path = require('path');

const HtmlWebpackPlugin = require("html-webpack-plugin");
const htmlWebpackPlugin = new HtmlWebpackPlugin({
    template: path.join(__dirname, "demo/src/index.html"),
    filename: "./index.html"
});

// const ExtractTextPlugin = require("extract-text-webpack-plugin");
// const extractTextPlugin = new ExtractTextPlugin('style.css');

/*
    Task example/src/index.js as the entry of the project handling the dependency relationship of resource files
    Use babel-loader to complie js and jsx files
    Use style-loader and css-loader to handle css dependencies and inject inline styles
    Use html-webpack-plugin to inject complied and packed script files
    devServer is to set the host and port of the web server (host is not necessary)
*/
module.exports = {
    entry: path.join(__dirname, "demo/src/index.js"),
    output: {
        path: path.join(__dirname, "demo/dist"),
        filename: "bundle.js",
        assetModuleFilename: "images/[name][ext]"  // for webpack5
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                use: "babel-loader",
                exclude: /node_modules/
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            // ==============================================================
            // 使用此配置，less编译成的css样式被放在<head></head>之间 （extractTextPlugin不需要）
            {
                test: /\.less$/,
                use: ["style-loader", "css-loader", "less-loader"]
            },
            // 使用此配置，less编译成的css样式被剥离在独立的css文件内（extractTextPlugin需要）
            // {
            //     test: /\.less$/,
            //     use: ExtractTextPlugin.extract({
            //         use:['css-loader', 'less-loader'],
            //         fallback:'style-loader'
            //     })
            // },
            // ==============================================================
            // {    // for webpack4
            //     test: /\.svg$/,
            //     use: ["svg-url-loader"]
            // },
            // {    // for webpack4
            //     test: /\.(png|jpg|jpeg|gif)$/,
            //     use: [
            //         {
            //             loader: "file-loader",
            //             options: {
            //                 name: "[name].[ext]",
            //                 // publicPath: "./images", // html的img标签src所指向图片的位置，基本与outputPath一致
            //                 // outputPath: "images",   // 打包图片放置的位置，这个路径是相对example/dist路径的
            //                 esModule: false,
            //             }
            //         }
            //     ],
            //     type: "javascript/auto"
            // },
            {   // for webpack5
                test: /\.(png|jpg|jpeg|gif|svg)$/,
                type: "asset/resource", // for webpack5
            },
        ]
    },
    plugins: [htmlWebpackPlugin/*, extractTextPlugin*/],
    resolve: {
        extensions: [".js", ".jsx"]
    },
    devServer: {
        host: "0.0.0.0",
        port: 3001,
        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                pathRewrite:{'^/api' : ''},
                changeOrigin: true
            }
        },
        // static: {
        //     directory: path.join(__dirname, "/"),
        // },
    },
    mode: 'development'
};