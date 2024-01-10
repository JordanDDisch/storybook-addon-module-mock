import { addons, types } from '@storybook/addons';
import { useChannel } from '@storybook/api';
import { TabWrapper } from '@storybook/components';
import React, { useState } from 'react';
import { JSONTree } from 'react-json-tree';
import { ADDON_ID, TAB_ID } from './types.js';
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
    const [mocks, setMocks] = useState(undefined);
    useChannel({
        [ADDON_ID]: (mocks) => {
            setMocks(mocks);
        },
    });
    return (React.createElement("div", null, mocks &&
        mocks.map(([name, mock], index) => (React.createElement("div", { key: name + index },
            React.createElement("div", { style: { padding: '4px 4px 0', color: 'green' } }, name),
            React.createElement("div", { style: { padding: '0 4px', color: 'blue', marginTop: '-4px' } },
                React.createElement(JSONTree, { data: mock, theme: theme })),
            React.createElement("hr", null))))));
};
const render = ({ active }) => (React.createElement(TabWrapper, { active: !!active },
    React.createElement(Panel, null)));
addons.register(ADDON_ID, (api) => {
    const property = { count: 0 };
    const addPanel = () => addons.add(TAB_ID, {
        type: types.PANEL,
        title: () => {
            const [count, setCount] = useState(property.count);
            property.setCount = setCount;
            return React.createElement(React.Fragment, null,
                "Mocks",
                count ? `(${count})` : '');
        },
        render,
    });
    api.on(ADDON_ID, (mocks) => {
        property.count = mocks.length;
        property.setCount?.(property.count);
    });
    addPanel();
});
