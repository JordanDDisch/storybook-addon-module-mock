"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.render = exports.clearMock = exports.resetMock = exports.getMock = exports.getOriginal = exports.createMock = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const jest_1 = require("@storybook/jest");
const hookFn = (hook) => {
    const fnSrc = jest_1.jest.fn();
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
const createMock = (module, name = 'default') => {
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
exports.createMock = createMock;
const getOriginal = (mock) => {
    return mock.__original;
};
exports.getOriginal = getOriginal;
const getMock = (parameters, module, name = 'default') => {
    const mock = parameters.moduleMock.mocks?.find((mock) => {
        return mock.__module?.module === module && mock.__module?.name === name;
    });
    if (!mock)
        throw new Error("Can't find mock");
    return mock;
};
exports.getMock = getMock;
const resetMock = (parameters) => {
    parameters.moduleMock.mocks?.forEach((mock) => {
        return mock.mockReset();
    });
};
exports.resetMock = resetMock;
const clearMock = (parameters) => {
    parameters.moduleMock.mocks?.forEach((mock) => {
        return mock.mockClear();
    });
};
exports.clearMock = clearMock;
const render = (parameters, args) => {
    parameters.moduleMock.render(args);
};
exports.render = render;
