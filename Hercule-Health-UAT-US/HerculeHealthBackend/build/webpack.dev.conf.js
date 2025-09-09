const resolve = require('path').resolve

module.exports = {
  entry: [ './server.js' ],
  output: {
    filename: '[name].js',
    path: resolve(__dirname, './dev-build'),
    clean:true
  },
  mode:'development',
  target: 'node',
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
  }
}