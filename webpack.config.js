const path = require('path')
const autoprefixer = require('autoprefixer')

const config = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['react', 'es2015', 'stage-2'],
            },
          },
        ],
      },
      {
        test: /\.css$/,
        exclude: /node_modules/,
        use: [
          'style-loader?sourceMap',
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: [autoprefixer()],
            },
          },
        ],
      },
    ],
  },
  node: {
    fs: 'empty',
  },
  resolve: {
    modules: [path.resolve('.'), 'node_modules'],
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs2: 'react-dom',
      commonjs: 'react-dom',
      amd: 'react-dom',
    },
    'prop-types': {
      root: 'PropTypes',
      commonjs2: 'prop-types',
      commonjs: 'prop-types',
      amd: 'prop-types',
    },
  },
  entry: ['./index.js'],
  output: {
    path: __dirname + '/lib',
    filename: 'bundle.js',
    libraryTarget: 'commonjs2',
    library: 'ReactSpreadsheetGrid',
  },
}

module.exports = config
