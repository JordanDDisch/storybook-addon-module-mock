import { ImportWriterPlugin } from './plugins/webpack-import-writer.js';
export const managerEntries = (entry = []) => [
    ...entry,
    require.resolve('./register'),
];
export const babel = async (config, options) => {
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
export async function webpackFinal(config) {
    config.plugins = [...(config.plugins ?? []), new ImportWriterPlugin()];
    return config;
}
export const config = (entry = []) => [
    ...entry,
    require.resolve('./preview'),
];
