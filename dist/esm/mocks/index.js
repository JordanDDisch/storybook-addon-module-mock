/* eslint-disable @typescript-eslint/no-explicit-any */
import { jest } from '@storybook/jest';
const hookFn = (hook) => {
    const fnSrc = jest.fn();
    const fn = Object.assign((...args) => {
        const result = fnSrc(...args);
        hook(fnSrc);
        return result;
    }, fnSrc);
    fn.bind(fnSrc);
    Object.defineProperty(fn, 'mock', {
        get: () => {
            return fnSrc.mock;
        },
    });
    return fn;
};
export const createMock = (module, name = 'default') => {
    const moduleName = module.constructor.prototype.__moduleId__;
    const funcName = name;
    const fn = hookFn(() => {
        fn.__module.event?.();
    });
    const descriptor = Object.getOwnPropertyDescriptor(module, name);
    let original;
    if (descriptor?.writable) {
        const f = module[name];
        module[name] = fn;
        original = f;
        fn.mockRestore = () => {
            module[name] = f;
        };
    }
    else if ('$$mock$$' in module) {
        const mock = module.$$mock$$;
        const f = mock(name, fn);
        original = f;
        fn.mockRestore = () => {
            mock(name, f);
        };
    }
    else {
        throw new Error('Failed to write mock');
    }
    return Object.assign(fn, {
        __module: { module, name },
        __name: `[${moduleName ?? 'unknown'}]:${String(funcName)}`,
        __original: original,
    });
};
export const getOriginal = (mock) => {
    return mock.__original;
};
export const getMock = (parameters, module, name = 'default') => {
    const mock = parameters.moduleMock.mocks?.find((mock) => {
        return mock.__module?.module === module && mock.__module?.name === name;
    });
    if (!mock)
        throw new Error("Can't find mock");
    return mock;
};
export const resetMock = (parameters) => {
    parameters.moduleMock.mocks?.forEach((mock) => {
        return mock.mockReset();
    });
};
export const clearMock = (parameters) => {
    parameters.moduleMock.mocks?.forEach((mock) => {
        return mock.mockClear();
    });
};
export const render = (parameters, args) => {
    parameters.moduleMock.render(args);
};
