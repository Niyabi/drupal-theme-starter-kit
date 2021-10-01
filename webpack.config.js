const path = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const IgnoreEmitPlugin = require('ignore-emit-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin");

let mode = "development";

if (process.env.NODE_ENV === "production") {
    mode = "production";
}

module.exports = {
    mode: mode,

    entry: {
        //output filename: path/to/source/file

        //theme js files
        js_index: "./src/js/index.js",
        // You can add multiple files to one entry
        // theme_js_index: ["./src/js/index.js", "./src/js/test.js"],
        
        //theme critical js files
        js_critical_index: "./src/js/critical/critical_index.js",

        //theme ts files
        //js_index: "./src/ts/index.ts",
        //theme critical ts files
        //js_critical_index: "./src/ts/critical/critical_index.ts",

        //theme css files
        css_base_index: "./src/styles/index.scss",

        //theme critical css files
        css_critical_index: "./src/styles/critical_styles/critical_index.scss",
    },

    output: {
        //output directory
        path: path.resolve(__dirname, "public"),
        filename: 'js/[name].js',
    },

    module: {
        rules: [
            {
                test: /\.(s[ac]|c)ss$/i,
                exclude: /node_modules/,
                use: [
                    {
                        loader: MiniCssExtractPlugin.loader,
                        options: { publicPath: "" }
                    },
                    {
                    loader: "css-loader",
                    options: {
                        sourceMap: true,
                        modules: false,}
                    }, 
                    {
                        loader: "postcss-loader",
                        options: {
                            sourceMap: true,
                        }
                    }, 
                    {
                        loader: "sass-loader",
                        options: {
                            sourceMap: true,
                        }
                    }
                ],
            },
            {
                test: /\.js?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                }
            },
            {
                test: /\.ts?$/,
                exclude: /node_modules/,
                use: {
                    loader: "ts-loader",
                }
            }
        ]
    },

    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            //output css files to styles folder
            // filename: 'styles/[name].css'
            filename: (pathData) => {
                let name = pathData.chunk.name;
                let directory = "";

                if (name.includes("base")){
                    directory = "base/";
                }
                else if (name.includes("critical"))
                {
                    directory = "critical/";
                }

                return "styles/"+directory+"[name].css"
            }
        }),
        new IgnoreEmitPlugin(/css_.*\.js$/),
        new ImageMinimizerPlugin({
            minimizerOptions: {
                // Lossless optimization with custom option
                // Feel free to experiment with options for better result for you
                plugins: [
                    ["gifsicle", { 
                        interlaced: true ,
                        optimizationLevel: 3
                    }],
                    ["mozjpeg", { 
                        progressive: true,
                        quality: 80, 
                    }],
                    ["pngquant", { quality: [0.7, 0.8] }],
                    // Svgo configuration here https://github.com/svg/svgo#configuration
                    ["svgo", { }],
                ],
            },
        }),
        new CopyPlugin({
            patterns: [
                // images
                {
                    from: "./src/images/*.png",
                    to: "images/[name][ext]",
                    noErrorOnMissing: true,
                },
                {
                    from: "./src/images/*.jpg",
                    to: "images/[name][ext]",
                    noErrorOnMissing: true,
                },
                {
                    from: "./src/images/*.jpeg",
                    to: "images/[name][ext]",
                    noErrorOnMissing: true,
                },
                {
                    from: "./src/images/*.gif",
                    to: "images/[name][ext]",
                    noErrorOnMissing: true,
                },
                {
                    from: "./src/images/*.svg",
                    to: "images/[name][ext]",
                    noErrorOnMissing: true,
                },
                // fonts
                {
                    from: "./src/fonts/*.otf",
                    to: "fonts/[name][ext]",
                    noErrorOnMissing: true,
                },
                {
                    from: "./src/fonts/*.ttf",
                    to: "fonts/[name][ext]",
                    noErrorOnMissing: true,
                },
                {
                    from: "./src/fonts/*.eot",
                    to: "fonts/[name][ext]",
                    noErrorOnMissing: true,
                },
                {
                    from: "./src/fonts/*.woff",
                    to: "fonts/[name][ext]",
                    noErrorOnMissing: true,
                },
                {
                    from: "./src/fonts/*.woff2",
                    to: "fonts/[name][ext]",
                    noErrorOnMissing: true,
                }
            ]
        }),
        new BrowserSyncPlugin({
            host: "https://localhost",
            port: 3000,
            proxy: "https://demo.lndo.site/",
            files: [
                "**/*.css",
                {
                    match: "**/*.js",
                    options: {
                        ignored: "public/**/*.js"
                    }
                }
            ],
            reloadDelay: 0,
        },
        {
            reload: false,
        }),
    ],

    resolve: {
        extensions: [".js, .ts"],
    },

    devtool: "source-map",
};
