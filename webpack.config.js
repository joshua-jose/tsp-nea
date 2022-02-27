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
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
        },
        module: {
            rules: [
                {

                    test: /\.ts(x?)$/,
                    include: path.join(__dirname, 'app/renderer/'),
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'ts-loader',
                            options: {
                                configFile: path.resolve('./tsconfig.json')
                            },
                        }
                    ]

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
        plugins: [
            new HtmlWebpackPlugin({
                template: './app/renderer/index.html'
            })
        ]
    }
];