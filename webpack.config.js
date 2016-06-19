'use strict';

module.exports = {
    context: __dirname + '/src',
    devtool: 'source-map',
    entry: './entry.js',
    output: {
        path: __dirname + '/dist',
        filename: 'pineapple-lumps.js',
        library: 'pineappleLumps',
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [
            { test: /\.js$/, exclude: /node_modules/, loaders: ['babel', 'eslint']}
            // { test: /\.js$/, exclude: /node_modules/, loader: 'babel!eslint'}
        ]
    }
};
