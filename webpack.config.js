const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    index: ["@babel/polyfill", path.join(__dirname, "src/index.tsx")]
  },
  output: {
    path: __dirname + "/dist",
    filename: "index_bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: "html-loader"
          }
        ]
      },
      {
        test: /\.(css|scss)$/i,
        use: ["style-loader", "css-loader"]
      }
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 3000,
    historyApiFallback: true
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "index.html"),
      filename: "index.html",
      inject: "body",
      alwaysWriteToDisk: true
    })
  ]
};
