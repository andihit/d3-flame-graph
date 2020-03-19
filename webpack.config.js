const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const package = require('./package.json');

module.exports = [{
  context: path.join(__dirname, 'src'),
  entry: {
    './d3-flamegraph': './flamegraph.js',
    './d3-flamegraph.min': './flamegraph.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'flamegraph',
    libraryExport: 'default',
    libraryTarget: 'umd',
    globalObject: 'd3',
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'flamegraph.css', to: 'd3-flamegraph.css' },
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        test: /\.min\.js$/i,
      }),
    ],
  },
  devServer: {
    contentBase: [path.join(__dirname, 'examples'), path.join(__dirname, 'dist')],
  },
}, {
  context: path.join(__dirname, 'src'),
  entry: {
    './d3-flamegraph-colorMapper': './colorMapper.js',
    './d3-flamegraph-colorMapper.min': './colorMapper.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    library: 'colorMapper',
    libraryTarget: 'umd',
    globalObject: 'd3.flamegraph',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        test: /\.min\.js$/i,
      }),
    ],
  },
}, {
  context: path.join(__dirname, 'src', 'templates', 'base'),
  entry: './template.js',
  output: {
    path: path.resolve(__dirname, 'dist', 'templates'),
    filename: 'bundle.js',
  },
  plugins: [
    new CleanWebpackPlugin({
      protectWebpackAssets: false,
      cleanOnceBeforeBuildPatterns: [],
      cleanAfterEveryBuildPatterns: ['bundle.js'],
    }),
    new HtmlWebpackPlugin({
      template: 'template.html',
      filename: 'd3-flamegraph-base.html',
      inject: 'head',
      templateVersion: package.version,
    }),
    new ScriptExtHtmlWebpackPlugin({
      inline: ['bundle.js'],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader']
      },
    ],
  },
}];
