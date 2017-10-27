<h1 align="center">
  React Spreadsheet Table
  <br>
    🔲
</h1>

## The key features

This is an Excel-like Spreadsheet Table component that supports:

✅  Usage as a Data Table & as a Excel-like Spreadsheet Table

✅  Control by mouse & from keyboard

✅  Customizable cells & header content (you can use any other components for that)

✅  Flexible setting of disabled cells

✅  Performant scrolling for as many rows as you need

✅  Column resizing

✅  Customizable CSS styling

## Installation

This module is distributed via [npm][npm] and should be installed as one of your project's `dependencies`:

```
npm install --save react-spreadsheet-table
```

## Basic usage

```jsx
import SpreadsheetTable from 'react-spreadsheet-table'

class MySpreadsheetTable extends React.Component {

  render() {
    return (
      <SpreadsheetTable 
     
        /* Define columns of the table and how they get values */
        columns={[
          {
            title: 'Name',
            value: row => row.name 
          }, {
            title: 'Photo',
            value: (row) => {
              return (
                /* Use any other components as content of cells */
                <Image src={row.photo} />
              );
            }
          }, {
            title: 'Comment',
            /* Define the props of components based on { active, focus } of the cell state */
            value: (row, { active, focus }) => {
              return (
                <Input  
                  value={row.comment}
                  active={active}
                  focus={focus}
                />
              );
            }
          }
        ]}
        
        /* Define rows */
        rows=[{
          id: 'user1',
          name: 'John Doe',
          photo: 'photo1',
          comment: ''
        }, {
          id: 'user2',
          name: 'Doe John',
          photo: 'photo2',
          comment: ''
        }]
        
        /* Define a unique key getter for a row */
        getRowKey={row => row.id}
      />
    )
  }
}
```

## Props

### columns

```jsx
arrayOf({ 
    id: string / number, 
    title: string / func, 
    value: string / func(row, { active, focused, disabled }) 
}) 
``` 
> defaults to `[]`

> `isRequired`

This is the most important prop that defines columns of the table. Every item of the array is responsible for the corresponding column. `title` is what you want to put in the header of the column, it could be passed as a string or as a func returning a React element. `value` works the same way, but func receives `row` and current state of the cell (`{ active, focused, disabled }`) as parameters, so you can create an outpur based on them.

### rows
> `arrayOf(any)` | defaults to `[]`

> `isRequired`

This is an array of rows for the table. Every row will be passed to a `column.value` func (if you use it).

### getRowKey
> `func(row)`

> `isRequired`

This is a func that must return *unique* key for a row based on this row in a parameter.

### placeholder
> `string` | defaults to `"There are no rows"`

Used as a placeholder text when the `rows` array is empty.

### focusedCell
> `{ x: number, y: number }` | defaults to `null`

The cell with this `x, y` coordinates (starting from `0`) will be rendered as a focused cell initially.


### checkDisabledCell
> `func(row, columnId): bool`

Use this func to define what cells are disabled in the table. It gets `row` and `columnId` (defined as `column.id` in a`columns` array) as parameters and identifiers of a cell. It should return boolean `true / false`. A disabled cell gets special CSS-class and styles. Also, you can define a `column.value` output based on the `disabled` state parameter.

### onCellClick
> `func(row, columnId)`

A click handler function for a cell. It gets `row` and `columnId` (defined as `column.id` in a`columns` array) as parameters and identifiers of a cell.

### headerHeight
> `number` | defaults to `40`

The height of the header of the table in pixels. 

⚠️ Define it as a prop, not in CSS styles to not broke the scroll of the table. ⚠️

### cellHeight
> `number` | defaults to `48`

The height of a row of the table in pixels.

⚠️ Define it as a prop, not in CSS styles to not broke the scroll of the table. ⚠️

### columnsResize
> `bool` | defaults to `false`

Switch this on if you want the table has columns with resizable width.

### onColumnResize
> `func(widthValues: object)`

A callback called every time the width of a column was resized. Gets `widthValues` object as a parameter. `widthValues` has values of width for all the columns and a width of the table itself.


### columnWidth
> `arrayOf(number)`

Pass this array if you want initialize width of columns. A number value at every index should be a percent value of width for the column with the same index. For example, it could be `[ 50, 25, 25 ]`. Also, you can get it from `onColumnResize` callback to store somewhere and use for the next render.
