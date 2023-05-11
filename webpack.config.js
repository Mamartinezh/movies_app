
let path = require('path')
let htmlWebpackPlugin = require('html-webpack-plugin')

const ruleForJS = {
	test: /.\js$/,
	loader: 'babel-loader',
	options: {
		presets: [
			[
				'@babel/preset-react',
				{
					runtime: 'automatic'
				}
			]
		]
	}
}

const ruleForStyle = {
	test: /\.css$/,
	use: ['style-loader', 'css-loader']
}

const ruleForMedia = {
	test: /\.(png|svg|jpe?g|webp)$/,
	use: 'file-loader?name=./images/[name].[ext]'
}

const rules = [ruleForJS, ruleForStyle, ruleForMedia]

module.exports = {
	entry: './src/index.js',
	output: {
		path: path.resolve(__dirname, 'build')
	},
	plugins: [new htmlWebpackPlugin({template: './src/index.html'})],
	module: {rules},
	devServer: {
		open: true,
		port: 3005,
		compress: true
	}
}