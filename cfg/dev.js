'use strict';

let path = require('path');
let webpack = require('webpack');
let baseConfig = require('./base');
let defaultSettings = require('./defaults');

// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');

let config = Object.assign({}, baseConfig, {
  entry: [
    'webpack-dev-server/client?http://127.0.0.1:' + defaultSettings.port,
    'webpack/hot/only-dev-server',
    './src/index'
  ],
  cache: true,
  devtool: 'eval-source-map',
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    })
  ],
  module: defaultSettings.getDefaultModules()
});


//null                   -> {}
//?                      -> {}
//?flag                  -> { flag: true }
//	?+flag                 -> { flag: true }
//?-flag                 -> { flag: false }
//?xyz=test              -> { xyz: "test" }
//	?xyz[]=a               -> { xyz: ["a"] }
//		?flag1&flag2           -> { flag1: true, flag2: true }
//?+flag1,-flag2         -> { flag1: true, flag2: false }
//?xyz[]=a,xyz[]=b       -> { xyz: ["a", "b"] }
//?a%2C%26b=c%2C%26d     -> { "a,&b": "c,&d" }
//?{json:5,data:{a:1}}   -> { json: 5, data: { a: 1 } }



// Add needed loaders to the defaults here
config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'react-hot!babel-loader?presets[]=es2015,presets[]=stage-0,presets[]=react&plugins[]=transform-runtime',
  include: [].concat(
    config.additionalPaths,
    [ path.join(__dirname, '/../src') ]
  )
});

module.exports = config;
