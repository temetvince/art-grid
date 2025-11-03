/* eslint-disable @typescript-eslint/no-var-requires */
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = (env, argv) => {
  const isProd = argv.mode === 'production';

  return {
    entry: './src/index.tsx',

    mode: isProd ? 'production' : 'development',
    devtool: isProd ? 'source-map' : 'inline-source-map',

    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/[name].[contenthash:8].js',
      publicPath: '/art-grid/',  // <-- KEY FIX: Matches GitHub sub-path
      clean: true,
    },

    target: 'web',

    devServer: {
      port: '3000',
      static: { directory: path.join(__dirname, 'public') },
      open: true,
      hot: true,
      liveReload: true,
      historyApiFallback: true,
    },

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    },

    module: {
      rules: [
        {
          test: /\.(js|jsx|ts|tsx)$/,
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.(jpe?g|png|gif|svg|webp)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'assets/[name].[contenthash:8][ext]',
          },
        },
      ],
    },

    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, 'public', 'index.html'),
        filename: 'index.html',
        inject: true,
        // Pass BASE_HREF for <base> tag
        templateParameters: {
          BASE_HREF: '/art-grid/',  // <-- KEY FIX: Matches sub-path
        },
      }),
    ],

    optimization: {
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
          },
        },
      },
    },
  };
};
