const CopyPlugin = require("copy-webpack-plugin");
const path = require('path');
module.exports = {
    entry: './src/js/app.js',
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