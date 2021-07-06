const TerserJSPlugin = require( 'terser-webpack-plugin' );
const FriendlyErrorsPlugin = require( 'friendly-errors-webpack-plugin' );

module.exports = ( ) => {
    return {
        mode: 'production',
        entry: {
            index: './index.js'
        },
        output: {
            path: __dirname,
            filename: 'index.min.js',
            library: 'FetchWrapper',
            libraryTarget: 'commonjs2'
        },
        module: {
            rules: [
                {
                    enforce: 'pre',
                    test: /\.js$/,
                    exclude: /node_modules/,
                    loader: 'eslint-loader',
                    options: {
                        fix: false,
                        emitWarning: true,
                        emitError: true,
                        failOnError: true,
                        failOnWarning: true
                    }
                },
                {
                    test: /\.js$/,
                    exclude: /node_modules/,
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                presets: [
                                    '@babel/preset-env'
                                ]
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new FriendlyErrorsPlugin( {
                clearConsole: true
            } )
        ],
        optimization: {
            minimize: true,
            minimizer: [
                new TerserJSPlugin( {
                    test: /\.js(\?.*)?$/i
                } )
            ]
        }
    };
};
