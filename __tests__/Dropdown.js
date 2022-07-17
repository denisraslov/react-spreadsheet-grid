import React from 'react'
import renderer from 'react-test-renderer'
import Dropdown from './../src/dropdown'

test('Closed dropdown', () => {
  const tree = renderer
    .create(<Dropdown header={<span>Header</span>} body={<span>Body</span>} />)
    .toJSON()

  expect(tree).toMatchSnapshot()
})

test('Opened dropdown', () => {
  const tree = renderer
    .create(
      <Dropdown header={<span>Header</span>} body={<span>Body</span>} isOpen />
    )
    .toJSON()

  expect(tree).toMatchSnapshot()
})
