import { ModuleMock } from '../ModuleMock/types.js';
import type { Parameters as P } from '@storybook/react';
export declare const createMock: {
    <T extends {
        [key in N]: (...args: any[]) => unknown;
    }, N extends keyof T = 'default' extends keyof T ? keyof T : never>(module: T, name?: N): ModuleMock<T, N>;
    <T extends {
        [key in 'default']: (...args: any[]) => unknown;
    }>(module: T): ModuleMock<T, 'default'>;
};
export declare const getOriginal: <T extends { [key in N]: (...args: any[]) => unknown; }, N extends keyof T = "default" extends keyof T ? keyof T : never>(mock: ModuleMock<T, N>) => T[N] extends never ? any : T[N];
export declare const getMock: {
    <T extends {
        [key in N]: (...args: any[]) => unknown;
    }, N extends keyof T>(parameters: P, module: T, name: N): ModuleMock<T, N>;
    <T extends {
        [key in 'default']: (...args: any[]) => unknown;
    }>(parameters: P, module: T): ModuleMock<T, 'default'>;
};
export declare const resetMock: (parameters: P) => void;
export declare const clearMock: (parameters: P) => void;
export declare const render: (parameters: P, args?: {
    [key: string]: unknown;
} | undefined) => void;
