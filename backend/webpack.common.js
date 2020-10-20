const path = require("path");
const glob = require("glob");
const envDir = path.resolve(__dirname, 'webpack.env');
require('dotenv').config({path: envDir});
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FixStyleOnlyEntriesPlugin = require("webpack-fix-style-only-entries");
const ImageminPlugin = require("imagemin-webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

// 先に.env.webpackでディレクトリを指定する

/* ---------------------------------- 拡張関数 ---------------------------------- */
const entryFiles = (ext, ignoreArr, cwd) => {
    return glob.sync(`**/*.${ext}`, {
        ignore: ignoreArr,
        cwd: cwd
    });
};

// チャンクに最適な{フォルダ名：[ファイル、ファイル...]}の形に整形する
const entryChunk = (ext, ignoreArr, cwd, addChunkName = false) => {
    let obj = {};

    entryFiles(ext, ignoreArr, cwd).map(key => {
        const keyArr = key.split("/");
        const entryPath = `${cwd}${key}`;
        let parentDir = keyArr[0];

        // 対象フォルダのrootに置かれたファイルの場合、keyが1つで拡張子がつくので取り除く
        if (keyArr.length <= 1) {
            parentDir = parentDir.split(".")[0];
        }

        // js以外のチャンクは.名前を付け足して、FixStyleOnlyEntriesPluginで取り除く
        if (addChunkName) {
            parentDir = `${parentDir}_${addChunkName}`;
        }

        // すでにobjにフォルダ名のkeyがあればpush,そうじゃなければ代入
        obj[parentDir]
            ? obj[parentDir].push(entryPath)
            : (obj[parentDir] = [entryPath]);
    });
    return obj;
};

const jsChunk = root =>
    entryChunk(
        "+(js|ts)",
        ["**/_*.+(js|ts)", "utilities/**", "pages/**"],
        `./${root}/${process.env.JS_DIR}/`
    );

const jsChunkPages = root =>
    entryChunk(
        "+(js|ts)",
        ["**/_*.+(js|ts)", "utilities/**"],
        `./${root}/${process.env.JS_DIR}/pages/`
    );

const styleChunk = root =>
    entryChunk(
        "scss",
        ["**/_*.scss", "pages/**"],
        `./${root}/${process.env.STYLE_DIR}/`,
        "style"
    );

const styleChunkPages = root =>
    entryChunk("scss", ["**/_*.scss"], `./${root}/${process.env.STYLE_DIR}/pages/`, "style");

const staticChunk = root =>
    entryChunk(
        "+(jpg|png|gif|svg|ttf|woff|css)",
        ["**/_*.+(jpg|png|gif|svg|ttf|woff|css)"],
        `./${root}/${process.env.IMAGE_DIR}/`,
        "static"
    );

const mergeChunks = root => {
    return {
        ...jsChunk(root),
        ...jsChunkPages(root),
        ...styleChunk(root),
        ...styleChunkPages(root),
        ...staticChunk(root)
    };
};

/* ----------------------------- webpackの処理はここから ---------------------------- */

module.exports = (enabledSourceMap = false) => {
    return {
        entry: mergeChunks(process.env.ENTRY),
        output: {
            path: path.resolve(__dirname, `${process.env.OUTPUT}`),
            filename: `${process.env.JS_DIR}/[name].bundle.js`
        },
        devServer: {
            open: true,
            watchContentBase: true,
            contentBase: path.resolve(__dirname, `${process.env.WATCH_DIR}`),
            publicPath: "/",
            port: 3000,
            proxy: {
                "*": "http://localhost:8000/"
            }
        },
        resolve: {
            extensions: [".ts", ".js"],
            alias: {
                atoms: path.resolve(
                    __dirname,
                    `${process.env.ENTRY}/${process.env.JS_DIR}/components/atoms/`
                ),
                molecules: path.resolve(
                    __dirname,
                    `${process.env.ENTRY}/${process.env.JS_DIR}/components/molecules/`
                ),
                organisms: path.resolve(
                    __dirname,
                    `${process.env.ENTRY}/${process.env.JS_DIR}/components/organisms/`
                ),
                templates: path.resolve(
                    __dirname,
                    `${process.env.ENTRY}/${process.env.JS_DIR}/components/templates/`
                ),
                utilities: path.resolve(
                    __dirname,
                    `${process.env.ENTRY}/${process.env.JS_DIR}/utilities/`
                )
            }
        },
        optimization: {
            usedExports: true,
            splitChunks: {
                cacheGroups: {
                    vendorModules: {
                        name: "vendorModules",
                        test: /html\/node_modules/,
                        chunks: "initial",
                        enforce: true
                    },
                    utilities: {
                        name: "utilities",
                        test: /html\/.+\/src\/js\/utilities/,
                        chunks: "initial",
                        enforce: true
                    }
                }
            }
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    exclude: /node_modules\/(?!(dom7|swiper)\/).*/,
                    use: {
                        loader: "babel-loader"
                    }
                },
                {
                    test: /\.ts$/,
                    exclude: /node_modules/,
                    use: [{ loader: "babel-loader" }, { loader: "ts-loader" }]
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader
                        },
                        {
                            loader: "css-loader",
                            options: {
                                sourceMap: enabledSourceMap,
                                importLoaders: 2
                            }
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                sourceMap: enabledSourceMap,
                                plugins: [
                                    require("autoprefixer")({
                                        grid: true
                                    })
                                ]
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: enabledSourceMap
                            }
                        },
                        {
                            loader: "import-glob-loader"
                        }
                    ]
                },
                {
                    test: /\.(jpe?g|png|gif|svg|ttf|woff|css)$/i,
                    use: [
                        {
                            loader: "file-loader",
                            options: {
                                emitFile: true,
                                name: `${process.env.IMAGE_DIR}/[folder]/[name].[ext]`
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new FixStyleOnlyEntriesPlugin({
                extensions: [
                    "css",
                    "sass",
                    "scss",
                    "styl",
                    "jpg",
                    "jpeg",
                    "png",
                    "gif",
                    "mp4",
                    "mp3",
                    "svg",
                    "webp",
                    "ttf",
                    "woff"
                ],
                silent: true
            }),
            new MiniCssExtractPlugin({
                filename: `${process.env.STYLE_DIR}/[name].css`
            }),
            new HtmlWebpackPlugin({
                template: `${path.resolve(
                    __dirname,
                    process.env.TEMPLATE_DIR + process.env.TEMPLATE_NAME
                )}`,
                filename: `${path.resolve(
                    __dirname,
                    process.env.TEMPLATE_DIR + "_" + process.env.TEMPLATE_NAME
                )}`,
                hash: true
            }),
            new ImageminPlugin({
                bail: false, // Ignore errors on corrupted images
                cache: true,
                imageminOptions: {
                    plugins: [
                        ["gifsicle", { interlaced: true }],
                        ["mozjpeg", { quality: 80 }],
                        ["pngquant", { quality: [0.6, 0.8] }],
                        [
                            "svgo",
                            {
                                plugins: [
                                    {
                                        removeViewBox: false
                                    }
                                ]
                            }
                        ]
                    ]
                }
            })
        ]
    };
};
