const path = require("path")
const MyFilePlugin = require("./src/plugins")
const { config } = require("webpack")
const { CleanWebpackPlugin } = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
// console.log(new MyFilePlugin())

const myConfig = (env) => {
  let mode = "production"
  if (env.dev) {
    mode = "development"
  }
  const res = {
    mode,
    //entry的本质是chunk
    //   entry: "./src/index.ts", // 这是简写
    entry: {
      main: "./src/test.js",
    },
    output: {
      filename: "[name].[chunkhash:5].js", // 打包后的文件名
      path: path.resolve(__dirname, "dist"), // 打包后的目录
    },
    module: {
      rules: [
        //   {
        //     test: /\.tsx?$/, //路径匹配
        //     // use: ["ts-loader"],//loader路径配置,其实用的就是node的require
        //     use: [
        //       {
        //         loader: ["ts-loader"],
        //         options: {},
        //       },
        //     ],
        //     exclude: /node_modules/,
        //   },
        //   {
        //     test: /\.js/,
        //     use: ["./src/loaders/testloader/loader", "./src/loaders/testloader/loader2"],
        //   },
        //   {
        //     test: /test\.js/,
        //     use: ["./src/loaders/testloader/loader3", "./src/loaders/testloader/loader2"],
        //   },
        {
          test: /\.css$/,
          use: ["./src/loaders/cssLoader"],
        },
        {
          test: /\.(jpeg)|(jpg)|(png)|(webp)$/,
          use: [
            {
              loader: "./src/loaders/imgLoader",
              options: {
                limit: 10000,
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new MyFilePlugin(),
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: "./public/index.html",
        //默认是所有js bundle都放在页面里
        chunks: ["main"],
        filename: "main.html",
      }),
      new CopyWebpackPlugin([
        {
          from: "./public",
          to: "./",
        },
      ]),
    ],
    resolve: {
      extensions: [".tsx", ".ts", ".js"], // 解析文件扩展名
    },
    //source map的配置
    //source map 一般生产环境不会使用，因为会暴露源码
    // development 默认 eval
    // production 默认 none
    devtool: "source-map",
  }
  return res
}
module.exports = myConfig
