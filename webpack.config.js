module.exports = {
  entry: './game.js',
  output: {
    filename: 'bundle.js',
    path: __dirname
  },
  plugins: [
    new (require('babili-webpack-plugin'))()
  ]
}
