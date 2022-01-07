// webpack.config.js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");
const { IgnorePlugin } = require('webpack');

//const glob = require("glob");

const optionalPlugins = [];
if (process.platform !== "darwin")
    optionalPlugins.push(new IgnorePlugin({ resourceRegExp: /^fsevents$/ }));

module.exports = [
    {
        mode: 'development',
        entry: ['./app/main/main.js'],
        target: 'electron-main',

        externals: {
            zeromq: 'commonjs2 zeromq'
        },

        module: {
            rules: [{
                test: /\.ts$/,
                include: path.join(__dirname, 'app/main/'),
                use: [{ loader: 'ts-loader' }]
            }]
        },
        output: {
            path: __dirname + '/dist',
            filename: 'main.bundle.js'
        },
        plugins: [
            ...optionalPlugins,
        ],
    },
    {
        mode: 'development',
        entry: './app/main/preload.js',
        target: 'electron-preload',
        output: {
            path: path.join(__dirname, 'dist'),
            filename: 'preload.js'
        }
    },
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
                }]
        },
        output: {
            path: __dirname + '/dist',
            filename: 'renderer.bundle.js'
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: './app/renderer/index.html'
            })
        ]
    }
];