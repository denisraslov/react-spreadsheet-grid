import React from 'react'
import renderer from 'react-test-renderer'
import ScrollDummy from './../src/scrollDummy'

test('ScrollDummy with rows', () => {
  const ref = React.createRef()
  const tree = renderer
    .create(
      <ScrollDummy
        headerHeight={50}
        rowHeight={50}
        rows={[1, 2, 3]}
        refEl={ref}
      />
    )
    .toJSON()

  expect(tree).toMatchSnapshot()
})

test('ScrollDummy without rows', () => {
  const ref = React.createRef()
  const tree = renderer
    .create(
      <ScrollDummy headerHeight={50} rowHeight={50} rows={[]} refEl={ref} />
    )
    .toJSON()

  expect(tree).toMatchSnapshot()
})
