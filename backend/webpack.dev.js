const { merge } = require("webpack-merge");
const common = require("./webpack.common");

module.exports = () =>
    merge(common(true), {
        mode: "development",
        devtool: "source-map",
        watch: true,
        watchOptions: {
            ignored: ["node_modules/**"]
        },
        cache: true
    });
