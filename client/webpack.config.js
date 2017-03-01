const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

var webpack = require('webpack');
var path = require('path');

module.exports = function(env) {

    var defaults = {
        entry: './apps/driver.js',
        externals: {
            'jquery': '$'
        },
        module: {
            rules: [
                {
                    test: /\.mo$/,
                    use: [{loader: 'buffer-loader'}]  // binary returns string and not Buffer
                },
                {
                    test: /\.po$/,
                    use: [{loader: 'raw-loader'}]
                },
                {
                    test: /\.json$/,
                    use: [{loader: 'json-loader'}]
                },
                {
                    test: /\.html$/,
                    use: [
                        {
                            loader: 'underscore-loader',
                            options: {
                                engine: 'underscore',
                                engineFull: null,
                                minify: true,
                                minifierOptions: {
                                    ignoreCustomFragments: [/<%[\s\S]*?%>/, /<\?[\s\S]*?\?>/],
                                    removeComments: true,
                                    collapseWhitespace: true,
                                    conservativeCollapse: true
                                },
                                templateOptions: {}
                            }
                        },
                        {
                            loader: 'html-minifier-loader'
                        }
                    ]
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: 'style-loader'
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                minimize: true
                            }
                        }
                    ]
                }
            ]
        },
        output: {
            path: path.join(__dirname, 'build'),
            filename: 'app.js',
            publicPath: '/build'
        },
        plugins: [
            new webpack.ProvidePlugin({_: 'underscore'})
        ],
        resolve: {
            modules: [
                path.join(__dirname, "app"),
                path.join(__dirname, "node_modules")
            ]
        }
    };

    if (env && env.minimized) {
        /*defaults.module.rules.push({
            test: /\.js$/,
            exclude: /.app.min.js/,
            use: [
                {
                    loader: 'uglify-loader',
                    options: {
                        mangle: false
                    }
                }
            ]
        });*/

        //defaults.devtool = "source-map";
        defaults.plugins.push(
            new webpack.LoaderOptionsPlugin({debug: false}),
            new UglifyJSPlugin({
                mangle: {
                    except: ['$super', '$', 'exports', 'require']
                },
                sourceMap: false,  // true, not for release
                minimize: true,
                compress: {
                    warnings: false
                }
        }));
        defaults.output.filename = 'app.min.js';
    } else {
        defaults.devtool = "source-map";
        defaults.devServer = {
            contentBase: path.join(__dirname, 'apps'),
            hot: true,
            inline: true
        };

        defaults.plugins.push(
            new webpack.LoaderOptionsPlugin({debug: true}),
            new webpack.HotModuleReplacementPlugin()
        );
    }

    return defaults;
};
