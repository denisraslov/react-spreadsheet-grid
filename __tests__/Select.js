import React from 'react'
import renderer from 'react-test-renderer'
import Select from './../src/select'

const items = [
  {
    id: 1,
    value: '1',
  },
  {
    id: 2,
    value: '2',
  },
  {
    id: 3,
    value: '3',
  },
]

test('Closed select', () => {
  const tree = renderer
    .create(<Select items={items} id={1} isOpen={false} />)
    .toJSON()

  expect(tree).toMatchSnapshot()
})

test('Closed select without a selected value', () => {
  const tree = renderer
    .create(<Select items={items} isOpen={false} placeholder='Placeholder' />)
    .toJSON()

  expect(tree).toMatchSnapshot()
})

test('Opened select', () => {
  const tree = renderer.create(<Select items={items} id={1} isOpen />).toJSON()

  expect(tree).toMatchSnapshot()
})
