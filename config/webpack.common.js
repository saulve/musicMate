const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

const config = {
  context: path.resolve("./src"),
  entry: {
    background: "./background.js",
    "popup/popup": "./popup/popup.js"
  },
  output: {
    path: path.resolve("./dist"),
    filename: "[name].js"
  },
  resolve: {
    extensions: [".js", ".vue", ".scss"]
  },
  node: false,
  module: {
    rules: [
      {
        test: /\.vue$/,
        loaders: "vue-loader"
      },
      {
        test: /\.js$/,
        loader: "babel-loader",
        exclude: /node_modules/
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"]
      },
      {
        test: /\.scss$/,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      },
      {
        test: /\.sass$/,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "sass-loader?indentedSyntax"
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|ico)$/,
        loader: "url-loader"
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: "[name].css"
    }),
    new CopyWebpackPlugin([
      { from: "icons", to: "icons", ignore: ["icon.xcf"] },
      { from: "popup/popup.html", to: "popup/popup.html" }
    ])
  ]
};

module.exports = config;
