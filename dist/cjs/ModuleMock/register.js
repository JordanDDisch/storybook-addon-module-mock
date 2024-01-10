"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const addons_1 = require("@storybook/addons");
const api_1 = require("@storybook/api");
const components_1 = require("@storybook/components");
const react_1 = __importStar(require("react"));
const react_json_tree_1 = require("react-json-tree");
const types_js_1 = require("./types.js");
const theme = {
    scheme: 'custom',
    base00: '#ffffff',
    base01: '#aeb8c4',
    base02: '#9b9b9b',
    base03: '#9b9a9a',
    base04: '#909090',
    base05: '#1e1e1e',
    base06: '#efefef',
    base07: '#9e9e9e',
    base08: '#f44336',
    base09: '#ff9800',
    base0A: '#ffeb3b',
    base0B: '#4caf50',
    base0C: '#00bcd4',
    base0D: '#2196f3',
    base0E: '#9c27b0',
    base0F: '#673ab7',
};
const Panel = () => {
    const [mocks, setMocks] = (0, react_1.useState)(undefined);
    (0, api_1.useChannel)({
        [types_js_1.ADDON_ID]: (mocks) => {
            setMocks(mocks);
        },
    });
    return (react_1.default.createElement("div", null, mocks &&
        mocks.map(([name, mock], index) => (react_1.default.createElement("div", { key: name + index },
            react_1.default.createElement("div", { style: { padding: '4px 4px 0', color: 'green' } }, name),
            react_1.default.createElement("div", { style: { padding: '0 4px', color: 'blue', marginTop: '-4px' } },
                react_1.default.createElement(react_json_tree_1.JSONTree, { data: mock, theme: theme })),
            react_1.default.createElement("hr", null))))));
};
const render = ({ active }) => (react_1.default.createElement(components_1.TabWrapper, { active: !!active },
    react_1.default.createElement(Panel, null)));
addons_1.addons.register(types_js_1.ADDON_ID, (api) => {
    const property = { count: 0 };
    const addPanel = () => addons_1.addons.add(types_js_1.TAB_ID, {
        type: addons_1.types.PANEL,
        title: () => {
            const [count, setCount] = (0, react_1.useState)(property.count);
            property.setCount = setCount;
            return react_1.default.createElement(react_1.default.Fragment, null,
                "Mocks",
                count ? `(${count})` : '');
        },
        render,
    });
    api.on(types_js_1.ADDON_ID, (mocks) => {
        property.count = mocks.length;
        property.setCount?.(property.count);
    });
    addPanel();
});
