const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');
module.exports = {
    entry: './src/js/app.js',
    devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '',
        filename: 'bundle.js'
    },
    mode: 'development',
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "assets/image", to: "image" },
                { from: "assets/level", to: "level" },
                { from: "assets/audio", to: "audio" }
            ],
        }),
    ],
    devServer: {
        static: {
            directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9000,
    },
}