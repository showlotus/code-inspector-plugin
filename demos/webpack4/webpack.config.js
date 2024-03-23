const HtmlWebpackPlugin = require('html-webpack-plugin')
const openInEditor = require('launch-editor-middleware')
const path = require('path')

let CodeInspectorPlugin = require('@showlotus/code-inspector-plugin')
CodeInspectorPlugin = CodeInspectorPlugin.default || CodeInspectorPlugin

module.exports = {
  mode: 'development',
  // mode: 'production',
  entry: './src/index.ts',
  devtool: 'inline-source-map',
  cache: false,
  stats: 'minimal',
  devServer: {
    before(app) {
      app.use('/__open-in-editor2', openInEditor('code'))
    },
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: ['ts-loader'],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
    }),
    new CodeInspectorPlugin({
      test: /\.ts$/,
      include: 'src/modules',
      exclude: ['utils.ts', /node_modules/],
      editor: 'code',
    }),
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js',
    },
    extensions: ['.ts', '.js'],
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
}
