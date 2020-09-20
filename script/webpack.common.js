const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const basePath = path.dirname(__dirname);

module.exports = {
  entry: path.resolve(basePath, "src/index.js"),
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
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env",{"targets": "> 0.25%, not dead"}]],
            plugins: [
              "@babel/plugin-transform-runtime",
              "@babel/plugin-transform-arrow-functions",
              "@babel/plugin-syntax-dynamic-import",
            ]
          }
        }
      },
    ]
  },
  output: {
    filename: "[name].[hash].js",
    path: path.resolve(basePath, "dist")
  }
};
