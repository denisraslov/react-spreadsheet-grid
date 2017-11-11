import React from 'react';
import renderer from 'react-test-renderer';
import Table from './../src/table';
import { columnsWithTextValues,
    columnsWithComponents,
    rows } from './../testKit'

test('Table without rows', () => {
    const tree = renderer.create(
        <Table
            columns={columnsWithTextValues}
            getRowKey={row => row.id}
            headerHeight={50}
            cellHeight={50}
            first={0}
            last={2}
        />
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

test('Table with columns with text values', () => {
    const tree = renderer.create(
        <Table
            columns={columnsWithTextValues}
            rows={rows}
            getRowKey={row => row.id}
            headerHeight={50}
            cellHeight={50}
            first={0}
            last={2}
        />
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

test('Table with columns with components', () => {
    const tree = renderer.create(
        <Table
            columns={columnsWithComponents}
            rows={rows}
            getRowKey={row => row.id}
            headerHeight={50}
            cellHeight={50}
            first={0}
            last={2}
        />
    ).toJSON();

    expect(tree).toMatchSnapshot();
});

