import React from 'react'
import renderer from 'react-test-renderer'
import ScrollWrapper from './../src/scrollWrapper'
import {
  columnsWithTextValues,
  columnsWithComponents,
  rows,
} from './../testKit'

test('ScrollWrapper without rows', () => {
  const tree = renderer
    .create(
      <ScrollWrapper
        columns={columnsWithTextValues}
        getRowKey={(row) => row.id}
      />
    )
    .toJSON()

  expect(tree).toMatchSnapshot()
})

test('ScrollWrapper with columns with text values', () => {
  const tree = renderer
    .create(
      <ScrollWrapper
        columns={columnsWithTextValues}
        rows={rows}
        getRowKey={(row) => row.id}
      />
    )
    .toJSON()

  expect(tree).toMatchSnapshot()
})

test('ScrollWrapper with columns with components', () => {
  const tree = renderer
    .create(
      <ScrollWrapper
        columns={columnsWithComponents}
        rows={rows}
        getRowKey={(row) => row.id}
      />
    )
    .toJSON()

  expect(tree).toMatchSnapshot()
})

test('ScrollWrapper with resizable columns', () => {
  const tree = renderer
    .create(
      <ScrollWrapper
        columns={columnsWithComponents}
        rows={rows}
        getRowKey={(row) => row.id}
        isColumnsResizable
      />
    )
    .toJSON()

  expect(tree).toMatchSnapshot()
})

test('ScrollWrapper - not scrollable', () => {
  const tree = renderer
    .create(
      <ScrollWrapper
        columns={columnsWithComponents}
        rows={rows}
        getRowKey={(row) => row.id}
        isColumnsResizable
        isScrollable={false}
      />
    )
    .toJSON()

  expect(tree).toMatchSnapshot()
})
