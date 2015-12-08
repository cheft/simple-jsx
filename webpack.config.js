var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'source-map',
  entry: {
    app: [
      // 'webpack/hot/dev-server',
      path.resolve('./example/index.js')
    ]
  },
  output: {
    path: path.resolve(__dirname, 'example/js'),
    filename: '[name].js',
    publicPath: '/'
  }
};
