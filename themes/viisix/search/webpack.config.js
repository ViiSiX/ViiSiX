path = require('path');

module.exports = {
    entry: {
        'search': "./search.js"
    },
    output: {
        path: path.resolve(__dirname, '../static/js'),
        filename: '[name].js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    }
};
