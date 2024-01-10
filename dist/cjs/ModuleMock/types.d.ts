import type { Mock } from 'jest-mock';
export declare const ADDON_ID = "storybook-addon-module-mock";
export declare const TAB_ID = "storybook-addon-module-mock/tab";
export type ModuleType<T, N> = {
    __module: {
        module: T;
        name: N;
        event?: () => void;
    };
    __name: string;
    __original: unknown;
};
export type Mocks = (Mock<unknown, unknown[]> & ModuleType<unknown, unknown>)[];
export type ModuleMock<T extends {
    [key: string | number]: (...args: unknown[]) => unknown;
}, N extends keyof T> = Mock<ReturnType<T[N]>, Parameters<T[N]>> & ModuleType<T, N>;
export type moduleMockParameter = {
    moduleMock: {
        mock?: () => Mocks;
        mocks?: Mocks;
        render: (args?: {
            [key: string]: unknown;
        }) => void;
    };
};
export type moduleMock = Pick<moduleMockParameter['moduleMock'], 'mock'>;
