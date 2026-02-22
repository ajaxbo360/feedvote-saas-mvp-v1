const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');

const fs = require('fs');
const Dotenv = require('dotenv-webpack');

const envPath = fs.existsSync('./.env.local') ? './.env.local' : './.env';

module.exports = {
  mode: process.env.NODE_ENV || 'production',
  entry: './src/widget/feedvote.js',
  output: {
    path: path.resolve(__dirname, 'public/widget'),
    filename: 'feedvote.min.js',
    clean: true,
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false,
          },
        },
        extractComments: false,
      }),
    ],
  },
  plugins: [
    new Dotenv({
      path: envPath,
      systemvars: true, // Load system variables as well (useful for CI/CD)
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
    ],
  },
};
