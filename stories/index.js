import React, { useState } from 'react'

import { storiesOf } from '@storybook/react'

import { Grid, Input, Select } from './../index'

const rows = []
const positions = []

for (let i = 0; i < 10; i++) {
  rows.push({
    id: i,
    firstName: 'First name ' + i,
    secondName: 'Second name ' + i,
    positionId: 3,
    age: i,
  })
}

for (let i = 1; i < 6; i++) {
  positions.push({
    id: i,
    name: 'Long Position Name ' + i,
  })
}

function DataTable(props) {
  const [rows, setRows] = useState(props.rows)

  const onFieldChange = (rowId, field) => (value) => {
    rows[rowId][field] = value
    setRows([].concat(rows))
  }

  const addRow = () => {
    const id = [...rows][rows.length - 1].id + 1
    const newRow = {
      id: id,
      firstName: 'First name ' + i,
      secondName: 'Second name ' + i,
      positionId: 3,
    }

    setRows(rows.concat(newRow))
  }

  const initColumns = () => {
    return [
      {
        title: 'First name',
        value: (row, { focus }) => {
          return (
            <Input
              value={row.firstName}
              focus={focus}
              onChange={onFieldChange(row.id, 'firstName')}
            />
          )
        },
        id: 'firstName',
      },
      {
        title: 'Second name',
        value: (row, { focus }) => {
          return (
            <Input
              value={row.secondName}
              focus={focus}
              onChange={onFieldChange(row.id, 'secondName')}
            />
          )
        },
        id: 'secondName',
      },
      {
        title: 'Position',
        value: (row, { focus }) => {
          return (
            <Select
              selectedId={row.positionId}
              isOpen={focus}
              items={positions}
              onChange={onFieldChange(row.id, 'positionId')}
            />
          )
        },
        id: 'position',
      },
      {
        title: 'Age',
        value: (row, { focus }) => {
          return (
            <Input
              value={row.age}
              focus={focus}
              onChange={onFieldChange(row.id, 'age')}
            />
          )
        },
        id: 'age',
        width: 10,
      },
    ]
  }

  const [columns, setColumns] = useState(initColumns())

  const onColumnResize = (widthValues) => {
    const newColumns = [].concat(columns)
    Object.keys(widthValues).forEach((columnId) => {
      const column = columns.find(({ id }) => id === columnId)
      column.width = widthValues[columnId]
    })
    setColumns(newColumns)
  }

  return (
    <div>
      <button onClick={addRow}>Add row</button>
      <div className='DataTable'>
        <Grid
          columns={columns}
          rows={rows}
          getRowKey={(row) => row.id}
          rowHeight={50}
          isColumnsResizable
          onColumnResize={onColumnResize}
          focusOnSingleClick={props.focusOnSingleClick}
          disabledCellChecker={(row, columnId) => {
            return columnId === 'age'
          }}
          isScrollable={props.isScrollable}
        />
      </div>
    </div>
  )
}

DataTable.defaultProps = {
  isScrollable: false,
  focusedOnClick: false,
}

storiesOf('Examples', module)
  .add('Scrollable grid', () => <DataTable rows={rows} isScrollable />)
  .add('Empty scrollable grid', () => <DataTable rows={[]} isScrollable />)
  .add('Focus on single click', () => (
    <DataTable rows={rows} focusOnSingleClick={true} isScrollable />
  ))
