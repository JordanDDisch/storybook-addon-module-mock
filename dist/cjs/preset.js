"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.webpackFinal = exports.babel = exports.managerEntries = void 0;
const webpack_import_writer_js_1 = require("./plugins/webpack-import-writer.js");
const managerEntries = (entry = []) => [
    ...entry,
    require.resolve('./register'),
];
exports.managerEntries = managerEntries;
const babel = async (config, options) => {
    if (options.configType !== 'PRODUCTION')
        return config;
    const { include, exclude } = options;
    return {
        ...config,
        plugins: [
            ...(config.plugins ?? []),
            [require.resolve('./plugins/babel-import-writer'), { include, exclude }],
        ],
    };
};
exports.babel = babel;
async function webpackFinal(config) {
    config.plugins = [...(config.plugins ?? []), new webpack_import_writer_js_1.ImportWriterPlugin()];
    return config;
}
exports.webpackFinal = webpackFinal;
const config = (entry = []) => [
    ...entry,
    require.resolve('./preview'),
];
exports.config = config;
