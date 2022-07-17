import React from 'react'
import renderer from 'react-test-renderer'
import Input from './../src/input'

test('Input with a value', () => {
  const tree = renderer.create(<Input value='Value' />).toJSON()

  expect(tree).toMatchSnapshot()
})

test('Input without a value', () => {
  const tree = renderer
    .create(<Input value='' placeholder='Placeholder' />)
    .toJSON()

  expect(tree).toMatchSnapshot()
})
