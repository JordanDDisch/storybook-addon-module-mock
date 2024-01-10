"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@babel/core");
const minimatch_1 = __importDefault(require("minimatch"));
const buildMocks = (0, core_1.template)(`
  const MOCKS = {};
  export const $$mock$$ = (name, value) => {
    if(typeof MOCKS[name] !== "function")
      throw new Error("Exported function not found.");
    return MOCKS[name](value);
  }
`);
const buildMock = (0, core_1.template)(`
  MOCKS[NAME] = function ($$value$$) {
    const $$temp$$ = LOCAL;
    LOCAL = $$value$$;
    return $$temp$$;
  };
`);
const isModuleExports = (path) => {
    let hasModuleExports = false;
    path.traverse({
        Identifier(idPath) {
            if (idPath.node.name === 'module' &&
                idPath.parentPath.node.property.name === 'exports') {
                hasModuleExports = true;
            }
        },
    });
    return hasModuleExports;
};
const isTarget = (fileName, options) => {
    const { include, exclude } = options;
    if (!fileName)
        return true;
    const isTarget = include?.some((i) => (i instanceof RegExp ? i.test(fileName) : (0, minimatch_1.default)(fileName, i))) ?? true;
    if (!isTarget || !exclude)
        return isTarget;
    return !exclude.some((i) => (i instanceof RegExp ? i.test(fileName) : (0, minimatch_1.default)(fileName, i)));
};
const getFileName = (path) => {
    return path.hub.file.opts
        .filename;
};
const plugin = (_, options) => {
    return {
        name: 'mocks',
        visitor: {
            Program: {
                enter(path, state) {
                    const fileName = getFileName(path);
                    state.isTarget = isTarget(fileName, options);
                    state.moduleExports = [];
                },
                exit(path, { isTarget: isEnable, moduleExports }) {
                    if (isEnable && !isModuleExports(path)) {
                        const mocks = path.scope.generateDeclaredUidIdentifier('$$mocks$$');
                        path.pushContainer('body', buildMocks({ MOCKS: mocks }));
                        moduleExports.forEach(([name, local]) => {
                            const mock = buildMock({
                                NAME: core_1.types.stringLiteral(name),
                                LOCAL: core_1.types.identifier(local),
                                MOCKS: mocks,
                            });
                            path.pushContainer('body', mock);
                        });
                    }
                },
            },
            ExportNamedDeclaration(path, { isTarget: isEnable, moduleExports }) {
                if (isEnable) {
                    const identifiers = path.getOuterBindingIdentifiers();
                    moduleExports.push(...Object.keys(identifiers).map((name) => [name, name]));
                }
            },
            ExportDefaultDeclaration(path, { isTarget: isEnable, moduleExports }) {
                if (isEnable) {
                    const declaration = path.node.declaration;
                    const name = core_1.types.isIdentifier(declaration) && declaration.name;
                    if (!name) {
                        if (core_1.types.isArrowFunctionExpression(declaration)) {
                            const id = path.scope.generateUidIdentifier('default');
                            const variableDeclaration = core_1.types.variableDeclaration('const', [
                                core_1.types.variableDeclarator(id, declaration),
                            ]);
                            path.replaceWith(core_1.types.exportDefaultDeclaration(id));
                            path.insertBefore(variableDeclaration);
                            moduleExports.push(['default', id.name]);
                        }
                    }
                    else {
                        const decl = core_1.types.exportNamedDeclaration(null, [
                            core_1.types.exportSpecifier(core_1.types.identifier(name), core_1.types.identifier('default')),
                        ]);
                        path.replaceWith(decl);
                        moduleExports.push(['default', name]);
                    }
                }
            },
        },
    };
};
exports.default = plugin;
