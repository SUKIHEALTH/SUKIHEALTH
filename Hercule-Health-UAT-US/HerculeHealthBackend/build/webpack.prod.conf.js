const resolve = require('path').resolve
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  entry: [ './server.js' ],
  output: {
    filename: '[name].js',
    path: resolve(__dirname, './prod-build'),
    clean:true
  },
  mode:'production',
  target: 'node',
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
        terserOptions: {
            compress: {
                drop_console:true
            }
        },
    })],
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ['html-loader']
      },
      // Add other loaders as needed
    ]
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
}