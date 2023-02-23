const path = require('path');

module.exports = {
    mode: 'development',
    cache: false,
    entry: './resources/index.js',
    output: {
        path: path.resolve(__dirname, 'www/js'),
        filename: 'index.js',
    },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react'],
                            plugins: ['@babel/plugin-proposal-object-rest-spread']
                        }
                    }
                ]
            },
            {
                test: /\.(css|scss)$/,
                // exclude: /(node_modules|bower_components)/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader',
                ]
            },
            {
                test: /\.(woff(2)?|ttf|eot|svg|png|jpe?g|gif)$/i,
                use: [
                    'file-loader'
                ],
            }
        ]
    }
};