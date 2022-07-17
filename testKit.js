import React from 'react'
import Input from './src/input'
import Select from './src/select'

export const columnsWithTextValues = [
  {
    id: 'name',
    title: () => 'Name',
    value: (row) => row.name,
  },
  {
    id: 'secondName',
    title: () => 'Second name',
    value: (row) => row.secondName,
  },
  {
    id: 'position',
    title: () => 'Position',
    value: (row) => row.position,
  },
]

export const columnsWithComponents = [
  {
    id: 'name',
    title: () => 'Name',
    value: (row) => row.name,
  },
  {
    id: 'secondName',
    title: () => 'Second name',
    value: () => {
      return (
        <Select
          selectedId={1}
          items={[
            {
              id: 1,
              value: 'Item 1',
            },
          ]}
        />
      )
    },
  },
  {
    id: 'position',
    title: () => 'Position',
    value: (row) => {
      return <Input value={row.position} />
    },
  },
]

export const rows = [
  {
    id: 1,
    name: 'Name 1',
    secondName: 'Second name 1',
    position: 'Position 1',
  },
  {
    id: 2,
    name: 'Name 2',
    secondName: 'Second name 2',
    position: 'Position 2',
  },
  {
    id: 3,
    name: 'Name 3',
    secondName: 'Second name 3',
    position: 'Position 3',
  },
]
