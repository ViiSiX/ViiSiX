path = require('path');

module.exports = {
    entry: {
        'pso': "./src/pso.jsx"
    },
    output: {
        path: path.resolve(__dirname, '../static/algorijs/js'),
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
