process.env.DISABLE_NOTIFIER = true;

var elixir = require('laravel-elixir'),
    webpack = require('webpack');

require('laravel-elixir-livereload');
require('laravel-elixir-webpack-official');

/*
 |--------------------------------------------------------------------------
 | Elixir Asset Management
 |--------------------------------------------------------------------------
 |
 | Elixir provides a clean, fluent API for defining some basic Gulp tasks
 | for your Laravel application. By default, we are compiling the Sass
 | file for our application, as well as publishing vendor resources.
 |
 */

elixir(function(mix) {
    /**
     * Bootstrap
     **/
    var bootstrapPath = 'node_modules/bootstrap-less';

    //var jQueryPath = 'node_modules/jquery';

    mix.copy(bootstrapPath, 'resources/vendor/bootstrap/');
    mix.copy(bootstrapPath + '/fonts', 'public/fonts');

    /**
     * JQuery
     **/
    mix.copy('node_modules/jquery/dist/jquery.min.js', 'public/js/jquery');

    //mix.copy('node_modules/ng2-bootstrap/bundles/ng2-bootstrap.min.js', 'public/js/bootstrap');

    /**
     * NG2 BS3 Modal
     **/
    mix.copy('node_modules/ng2-bs3-modal/bundles/ng2-bs3-modal.js', 'public/js');

    /**
     * Less
     **/
    mix.less('app.less');

    //mix.scripts([
        //jQueryPath + "dist/jquery.min.js",
        //bootstrapPath + "js/bootstrap.js"
    //], './', 'public/js/app.js');

    /**
     * Scripts webpack bundling and copying
     **/
    mix.webpack(
        [],
        'public/js',
        'resources/assets/typescript',
        {
            entry: {
                app: './resources/assets/typescript/main.ts',
                vendor: './resources/assets/typescript/vendor.ts'
            },
            debug: true,
            devtool: 'source-map',
            resolve: {
                extensions: ['', '.ts', '.js']
            },
            module: {
                loaders: [
                    {
                        test: /\.ts$/,
                        loader: 'awesome-typescript-loader',
                        exclude: /node_modules/
                    },
                    {
                        test: /\.html$/,
                        loader: 'raw-loader'
                    },
                    {
                        test: /bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
                        loader: 'imports?jQuery=jquery'
                    }
                ]
            },
            plugins: [
                new webpack.ProvidePlugin({
                    '__decorate': 'typescript-decorate',
                    '__extends': 'typescript-extends',
                    '__param': 'typescript-param',
                    '__metadata': 'typescript-metadata'
                }),
                new webpack.optimize.CommonsChunkPlugin({
                    name: 'vendor',
                    filename: 'vendor.js',
                    minChunks: Infinity
                }),
                new webpack.optimize.CommonsChunkPlugin({
                    name: 'app',
                    filename: 'app.js',
                    minChunks: 4,
                    chunks: [
                        'app'
                    ]
                }),
                new webpack.optimize.UglifyJsPlugin({
                    compress: {
                        warnings: false
                    },
                    sourceMap: true,
                    minimize: true,
                    mangle: false
                }),
                new webpack.ProvidePlugin({
                    jQuery: 'jquery',
                    $: 'jquery',
                    jquery: 'jquery'
                }),
            ],
            node: {
                global: 'window'
            }
        }
    );

    mix.styles([]);

    // mix.scripts([
    //         "./node_modules/jquery/dist/jquery.min.js",
    //         "./node_modules/bootstrap-less/js/bootstrap.js"
    //     ],  'public/js/scripts.js');
         //]);
    
    mix.version([
        'css/app.css',
        'js/app.js',
        'js/vendor.js'
    ]);

    mix.livereload([
        'public/build/css/*',
        'public/build/js/*'
    ]);
});
