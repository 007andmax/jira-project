const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = function () {
    return {
        entry: './src/main.ts',
        output: {
            path: __dirname + '/dist',
            filename: 'app.js'
        },
        configureWebpack: {
            module: {
                rules: [
                    {
                        test: /\.mjs$/,
                        include: /node_modules/,
                        type: "javascript/auto"
                    }
                ]
            }
        },
        plugins: [
            new webpack.DefinePlugin({
                'STABLE_FEATURE': JSON.stringify(true),
                'EXPERIMENTAL_FEATURE': JSON.stringify(false)
            }),
            new CopyWebpackPlugin([
                { from: 'src/assets', to: 'assets' }
            ]),
            new HtmlWebpackPlugin({
                template: __dirname + '/src/index.html',
                output: __dirname + '/dist',
                inject: 'head'
            })
        ]
    };
}