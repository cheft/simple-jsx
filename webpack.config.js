var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: {
    hello: [
      'webpack/hot/dev-server',
      path.resolve('./example/hello.js')
    ]
  },
  output: {
    path: path.resolve(__dirname, 'example/js'),
    filename: '[name].js',
    publicPath: '/example'
  }
};
