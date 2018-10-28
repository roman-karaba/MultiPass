const path = require('path');
const fs = require('fs');

const backendExternals = {};
fs.readdirSync('node_modules')
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach((mod) => {
    backendExternals[mod] = `commonjs ${mod}`;
  });

module.exports = {
  entry: [
    'babel-polyfill',
    './src/server.js'
  ],
  target: 'node',
  externals: backendExternals,
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js']
  },
  output: {
    path: path.join(__dirname, '/dist'),
    publicPath: '/',
    filename: 'backend-bundle.js'
  },
  devServer: {
    contentBase: './dist',
  }
};
