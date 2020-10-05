const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const basePath = path.dirname(__dirname);

module.exports = {
  entry: path.resolve(basePath, "src/index.ts"),
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(basePath, "public/index.html")
    }),
  ],
  optimization: {
    runtimeChunk: "single",
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          chunks: "all"
        }
      }
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // {
      //   test: /\.m?(ts|js)$/,
      //   exclude: /node_modules/,
      //   use: {
      //     loader: "babel-loader",
      //     options: {
      //       presets: ["@babel/preset-typescript"],
      //       plugins: [
      //         "@babel/plugin-transform-runtime",
      //         "@babel/plugin-transform-arrow-functions",
      //         "@babel/plugin-syntax-dynamic-import",
      //         "@babel/plugin-proposal-class-properties"
      //       ]
      //     }
      //   }
      // },
    ]
  },
  resolve:{
    extensions: [ '.tsx', '.ts', '.js' ],
  },
  output: {
    filename: "[name].[hash].js",
    path: path.resolve(basePath, "dist")
  }
};
