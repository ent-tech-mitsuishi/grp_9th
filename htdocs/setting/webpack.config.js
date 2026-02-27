module.exports = {
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './src/js/index.js',
  output: {
    filename: 'project.js',
  },
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
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};

exports.webpackConfig = module.exports;
