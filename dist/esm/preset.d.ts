import { TransformOptions } from '@babel/core';
import type { AddonOptions } from './types.js';
import type { StorybookConfig } from '@storybook/types';
import type { Options } from '@storybook/types';
import type { Configuration } from 'webpack';
export declare const managerEntries: (entry?: string[]) => string[];
export declare const babel: (config: TransformOptions, options: Options & AddonOptions) => Promise<TransformOptions>;
export declare function webpackFinal(config: Configuration): Promise<Configuration>;
export declare const config: StorybookConfig['previewAnnotations'];
