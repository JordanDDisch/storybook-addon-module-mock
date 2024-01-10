import { PluginObj } from '@babel/core';
import { AddonOptions } from '../types';
type PluginState = {
    moduleExports: [string, string][];
    isTarget: boolean;
};
declare const plugin: (_: unknown, options: AddonOptions) => PluginObj<PluginState>;
export default plugin;
