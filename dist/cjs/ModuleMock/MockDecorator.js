"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parameters = exports.MockDecorator = void 0;
const addons_1 = require("@storybook/addons");
const core_events_1 = require("@storybook/core-events");
const react_1 = __importDefault(require("react"));
const types_js_1 = require("./types.js");
const MockDecorator = (Story, context) => {
    const { parameters, name, id } = context;
    const emit = (0, addons_1.useChannel)({
        [core_events_1.STORY_RENDER_PHASE_CHANGED]: ({ newPhase, storyId }) => {
            if (newPhase === 'completed' && storyId === id) {
                if (moduleMock.mocks) {
                    moduleMock.mocks.forEach((mock) => mock.mockClear());
                }
            }
        },
    });
    const [{ args }, render] = (0, addons_1.useState)({});
    const params = (0, addons_1.useRef)(parameters);
    const { moduleMock } = params.current;
    if (!moduleMock?.mocks) {
        const m = moduleMock?.mock?.();
        const mocks = !m ? undefined : Array.isArray(m) ? m : [m];
        moduleMock.mocks = mocks;
        moduleMock.render = (args) => render({ args });
        if (mocks) {
            const sendStat = () => {
                emit(types_js_1.ADDON_ID, mocks.map((mock) => {
                    return [mock.__name, mock.mock];
                }));
            };
            mocks.forEach((mock) => (mock.__module.event = () => sendStat()));
            sendStat();
        }
        else {
            emit(types_js_1.ADDON_ID, []);
        }
    }
    (0, addons_1.useEffect)(() => {
        return () => {
            if (moduleMock.mocks) {
                moduleMock.mocks.forEach((mock) => mock.mockRestore());
                moduleMock.mocks = undefined;
            }
        };
    }, [id]);
    if (name === '$$mock$$')
        return react_1.default.createElement(react_1.default.Fragment, null);
    return Story(args ? { args } : undefined);
};
exports.MockDecorator = MockDecorator;
exports.parameters = {
    moduleMock: {
        render: () => {
            //
        },
    },
};
