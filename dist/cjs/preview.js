"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decorators = exports.parameters = void 0;
const MockDecorator_js_1 = require("./ModuleMock/MockDecorator.js");
const NodeInfoDecorator_js_1 = require("./NodeInfo/NodeInfoDecorator.js");
var MockDecorator_js_2 = require("./ModuleMock/MockDecorator.js");
Object.defineProperty(exports, "parameters", { enumerable: true, get: function () { return MockDecorator_js_2.parameters; } });
exports.decorators = [MockDecorator_js_1.MockDecorator, NodeInfoDecorator_js_1.NodeInfoDecorator];
