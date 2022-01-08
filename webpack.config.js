// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");

// packs renderer code alongside resources 
module.exports = [
    {
        mode: 'development',
        entry: ['./app/renderer/index.js'], // glob.sync("./app/renderer/*.js")
        target: 'electron-renderer',
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    include: path.join(__dirname, 'app/renderer/'),
                    use: [{ loader: 'ts-loader' }]
                },
                {
                    test: /\.(png|jpg|gif)$/i,
                    type: 'asset/resource'
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                }
            ]
        },
        output: {
            path: __dirname + '/dist/renderer',
            filename: 'renderer.bundle.js'
        },
        cache: {
            type: 'filesystem'
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './app/renderer/index.html'
            })
        ]
    }
];