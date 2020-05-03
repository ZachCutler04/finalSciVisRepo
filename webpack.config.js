const path = require('path');

module.exports = {
  // target: 'node',
  entry: path.join(__dirname, '/src/main.js'),
  target: 'web',
  output: {
    filename: 'bundle.js',
    path: __dirname
  },
  module: {
        rules: [
            {
                exclude: /node_modules/,
            },
        ]
    },
    resolve: {
      extensions: [".js"]
  },
};
