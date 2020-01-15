var path = require('path');
//基础构件base
var packageName = "base";
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const uglify = require('uglifyjs-webpack-plugin');
module.exports = {
	devtool: 'source-map',
	entry: {
		webDesigner:'./core/index.js'

	},  //入口文件
	output: {
		//入口文件输出配置
		filename: '[name].js',
		libraryTarget: 'umd',
		library: "[name]",
		path: path.resolve(__dirname, './build')
	},
  //排除打包外部框架
  externals:{
    'react':"React",
    'jquery':"$",
    'react-dom':"ReactDOM",
	"antd":"antd",
	"moment":"moment"
  },
  
  module:{
  	rules:[     //加载器
  		 { 
  		 	test: /\.(css|less)$/,
  		 	use:ExtractTextPlugin.extract({
	          fallback: "style-loader",
	          use: ['css-loader?modules&localIdentName=hk-[name]-[local]', 'less-loader'] 
	       })
  		 },
  		   {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.(css|less)$/,
          /\.json$/,
          /\.bmp$/,
          /\.gif$/,
          /\.jpe?g$/,
          /\.png$/,
        ],
        loader: require.resolve('file-loader'),
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      // "url" loader works just like "file" loader but it also embeds
      // assets smaller than specified size as data URLs to avoid requests.
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve('url-loader'),
        options: {
          limit: 1,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
  		{
  			test:/\.json$/,
  			loader:"json-loader"
  		},
  		{
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',//在webpack的module部分的loaders里进行配置即可
        query: {
          presets: ['es2015','react','stage-0']
        }
      }
  	]
  },
  plugins: [
    new ExtractTextPlugin('[name].css'),
    new uglify({
        sourceMap: true,
    })
  ]
};