const webpack = require('webpack');

module.exports = env => {
  let envKeys;
  if (env.NODE_ENV === 'prod') {
    envKeys = {
      "process.env": {
        apiHost: JSON.stringify("http://52.193.213.171/"),
      }
    }
  } else {
    envKeys = {
      "process.env": {
        apiHost: JSON.stringify("http://localhost:8000/"),
      }
    }
  }
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader"
          }
        },
        {
          test: /\.css$/,
          exclude: /node_modules/,
          use: ['style-loader', 'css-loader'],
        }
      ]
    },
    plugins: [
      new webpack.DefinePlugin(envKeys)
    ],
  }
}
