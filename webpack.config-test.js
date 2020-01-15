var path = require('path');
var webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  entry: {
    webDesignerTest:'./ComponentTest.js'
  },  //入口文件
  output: {                //入口文件输出配置
    
    path: path.resolve(__dirname, 'build'),
     publicPath: "/build/",
     libraryTarget: 'umd',
     library: "[name]",
	 filename: '[name].js'
  },
//排除打包外部框架
  externals:{
    'react':"React",
    'jquery':"$",
    'react-dom':"ReactDOM",
	"antd":"antd",
	"moment":"moment"
  },
    // 配置服务器
    devServer: {
    	contentBase: './',
       // colors: true,
	    historyApiFallback: true,
	    inline: true,
        port: 3030
    },
  module:{
  	loaders:[     //加载器
  		 { 
  		 	test: /\.(css|less)$/,
  		 	use:ExtractTextPlugin.extract({
	          fallback: "style-loader",
	          use: ['css-loader?modules&localIdentName=[local]', 'less-loader'] 
	       })
  		 },
  		   {
		        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
		        loader: 'url-loader'
       
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
 	 new webpack.HotModuleReplacementPlugin(),
    new ExtractTextPlugin('[name].css')
  ],
};