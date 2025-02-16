const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    background: path.join(__dirname, "src", "background.js"), // Background script
    popup: path.join(__dirname, "src", "popup.js"), // Popup script
    content_script: path.join(__dirname, "src", "content_script.js"), // Content script
    pascoli: path.join(__dirname, "src", "pascoli.js"), // Pascoli script
  },
  output: {
    path: path.join(__dirname, "dist"),
    filename: "[name].js",
    publicPath: "",
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
