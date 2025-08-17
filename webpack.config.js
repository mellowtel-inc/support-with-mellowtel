const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    background: path.join(__dirname, "src", "background.js"), // Background script
    popup: path.join(__dirname, "src", "popup.js"), // Popup script
    content_script: path.join(__dirname, "src", "content_script.js"), // Content script
    content_website: path.join(__dirname, "src", "content_website.js"), // Content website script
    pascoli: path.join(__dirname, "src", "pascoli.js"), // Pascoli script
    meucci: path.join(__dirname, "src", "meucci.js"), // Meucci script
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "",
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true //false, Change to true to disable console logs
          },
        },
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: ["file-loader"],
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: "public" }, // Copy all files from the 'public' folder to 'dist'
      ],
    }),
  ],
};
