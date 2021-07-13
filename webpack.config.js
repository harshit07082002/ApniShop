const path = require('path');
module.exports = {
  entry: {
    bundle1: ['./public/js/signup.js'],
    bundle2: ['./public/js/signin.js'],
    bundle3: ['babel-polyfill', './public/js/header.js'],
    bundle4: ['./public/js/createReview.js'],
    bundle5: ['./public/js/product.js'],
    bundle6: ['./public/js/cart.js'],
    bundle7: ['./public/js/security.js'],
    bundle8: ['./public/js/updateOrder.js'],
  },
  output: {
    path: path.resolve(__dirname, 'public/js'),
    filename: '[name].js',
  },
  devServer: {
    contentBase: './dist',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  },
};
