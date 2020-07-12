const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd
const fileName = (ext) => `bundle.${isProd? '[hash].' : ''}${ext}`
const isLoaders = () => {
  const loaders = [
    {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    },
  ]
  if (isDev) {
    loaders.push('eslint-loader')
  }
  return loaders
}
module.exports = {
  context: path.resolve(__dirname + '/src'),
  mode: 'development',
  entry: ['@babel/polyfill', './index.js'],
  output: {
    filename: fileName('js'),
    path: path.resolve(__dirname + '/build'),
  },
  resolve: {
    extensions: ['.js'],
    alias: { // import '../../../../component/App' or import '@/App'
      '@': path.resolve(__dirname, '/src'),
      '@core': path.resolve(__dirname, '/src/core'),
    },
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: 'index.html',
      minify: {
        removeComments: isProd,
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname + '/src/favicon.ico'),
          to: path.resolve(__dirname + '/build'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: fileName('css'),
    }),
  ],
  module: {
    rules: [
      {
        test: /\.((c|sa|sc)ss)$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: isDev,
              reloadAll: true,
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: isLoaders(),
      },
    ],
  },
  devtool: isDev? 'source-map': false,
  devServer: {
    contentBase: path.resolve(__dirname, '/build'),
    compress: true,
    port: 3000,
    hot: isDev,
  },
}
