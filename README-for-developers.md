0. Basic

    yarn start
    yarn run build  (build files and put built files into demo/dist/)
    npm config set registry https://registry.npmjs.com/
    yarn publish  (publish the package to the npm platform, need to input login password and one-time password)
    yarn publish-demo (publish demo/dist/ to gitHub Pages)

1. To solve the CORS issue

    Add the proxy config into devServer in the webpack.config.js file

        proxy: {
            '/api': {
                target: 'http://localhost:8000',
                pathRewrite:{'^/api' : ''},
                changeOrigin: true
            }
        }

2. To be accessed from other computers or cellphones

    Add the host config into devServer in the webpack.config.js file

        host: "0.0.0.0"

3. To solve the issue: regeneratorRuntime is not defined

    npm install --save-dev babel-plugin-transform-runtime
    配置.babelrc
    {
        "plugins": ["transform-runtime"]
    }

4. To solve the issue: fatal: A branch named 'gh-pages' already exists, while executing yarn publish-demo

    In chueasy_react_uploader\node_modules\.cache, delete gh-pages

5. less转成css

    npm install less -g 或 yarn add less -g
    lessc src/static/css/style1.less src/static/css/style1.css
    lessc src/static/css/style2.less src/static/css/style2.css
    
    为了执行yarn publish时，自动将less转为css，则把lessc src/static/css/style1.less src/static/css/style1.css && lessc src/static/css/style2.less src/static/css/style2.css添加到package.json的scripts的transpile配置。


6. webpack打包图片并让demo支持使用包里的图片

    # Use images in css files (webpack4) (已不推荐)

    npm install file-loader svg-url-loader --save-dev 或 yarn add file-loader svg-url-loader --dev

    修改webpack.config.js的module/rules配置，增加：
        {
            test: /\.(png|jpg|jpeg|gif)$/,
            use: [
                {
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        publicPath: "./images", // html的img标签src所指向图片的位置，基本与outputPath一致
                        outputPath: "images",   // 打包图片放置的位置，这个路径是相对example/dist路径的
                        esModule: false,
                    }
                }
            ]
        },
        {
            test: /\.svg$/,
            use: ["svg-url-loader"]
        },

    # Use images in css files (webpack5) (已不推荐)

    npm install file-loader --save-dev 或 yarn add file-loader --dev

    修改webpack.config.js的module/rules配置，增加：
        {
            test: /\.(png|jpg|jpeg|gif|svg)$/,
            use: [
                {
                    loader: "file-loader",
                    options: {
                        name: "[name].[ext]",
                        publicPath: "./images", // html的img标签src所指向图片的位置，基本与outputPath一致
                        outputPath: "images",   // 打包图片放置的位置，这个路径是相对example/dist路径的
                        esModule: false,
                    }
                }
            ],
            type: "javascript/auto"
        },
    
    # Use images in css files (webpack5) (推荐)

    修改webpack.config.js的module/rules配置，增加：
        {
            test: /\.(png|jpg|jpeg|gif|svg)$/,
            type: "asset/resource", // for webpack5
        },

    修改webpack.config.js的output配置，增加：
        assetModuleFilename: "images/[name].[ext]"

    # Use images in js files

    修改examples/index.js，用模块化的方式引用图片：
        var imgUrl1 = require('../../src/static/images/p1.jpg');    // 模块化方式引用图片路径，这样引用的图片才可以打包进dist文件夹
        var imgUrl2 = require('../../src/static/images/p2.jpg');

        let fileList = [
            {url: imgUrl1, filename: "p1.jpg"},
            {url: imgUrl2, filename: "p2.jpg"},
        ];

7. To solve the issue when executing yarn publish-demo

    warning: ----------------- SECURITY WARNING ----------------
    warning: | TLS certificate verification has been disabled! |
    warning: ---------------------------------------------------

    $ git config --global http.sslVerify true
    
    Generate a token:
        Github.com -> settings -> Developer settings -> Personal access tokens -> Generate new token -> Select repo option -> Generate token
    
    $ yarn publish-demo (input the new token)




