# React Spreadsheet Grid
> A customizable, performant and powerful spreadsheet grid component for React

![react-spreadsheet-table in action](https://raw.githubusercontent.com/denisraslov/react-spreadsheet-table/master/example.gif)

## The key features

This is an Excel-like Spreadsheet Grid component that supports:

✅  Control by mouse & from keyboard

✅  Customizable cells & header content (you can use any other components for that)

✅  Flexible setting of disabled cells

✅  Performant scroll for as many rows as you need

✅  Column resizing

✅  Customizable CSS styling

## Table of contents

-   [Installation](#installation)
-   [Basic usage](#basic-usage)
-   [Props](#props)
-   [Customizing CSS styles](#customizing-css-styles)
-   [Customizing cells & header content](#customizing-cells--header-content)
    -   [Built-in Input](#built-in-input)
    -   [Built-in Select](#built-in-select)
    -   [Another component](#another-component)
-   [Performant scrolling](#performant-scrolling)
-   [Disabled cells](#disabled-cells)

## Installation

This module is distributed via [npm][npm] and should be installed as one of your project's `dependencies`:

```
npm install --save react-spreadsheet-table
```

## Basic usage

```jsx
import { Table, Input, Select } from 'react-spreadsheet-table'

class MySpreadsheetTable extends React.Component {

  render() {
    return (
      <Table 
        /* Define columns of the table and how they get their values */
        columns={[
          {
            title: 'Name', 
            /* Define the props of components based on { active, focus, disabled } of the cell state */
            value: (row, { active, focus, disabled }) => {
              return (
                /* You can use the built-in Input */
                <Input  
                  value={row.name}
                  active={active}
                  focus={focus}
                />
              );
            }
          }, {
            title: 'Position',
            value: (row, { active, focus, disabled }) => {
                /* Also, you can use the built-in Select */
                <Select  
                  value={row.positionId}
                  isOpen={focus}
                  items={positions}
                />
            }
          }, {
            title: 'Manager',
            value: (row, { active, focus, disabled }) => {
              return (
                /* Also, you can use ANY OTHER components as a content for the cells */
                <Autocomplete  
                  value={row.managerId}
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
          positionId: 'position1',
          managerId: 'manager1'
        }, {
          id: 'user2',
          name: 'Doe John',
          positionId: 'position2',
          managerId: 'manager2'
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
> `func(widthValues: array)`

A callback called every time the width of a column was resized. Gets `widthValues` object as a parameter. `widthValues` has values of width for all the columns and a width of the table itself.


### columnWidth
> `arrayOf(number)`

Pass this array if you want initialize width of columns. A number value at every index should be a percent value of width for the column with the same index. For example, it could be `[ 50, 25, 25 ]`. Also, you can get it from `onColumnResize` callback to store somewhere and use for the next render to make columns stay with the same width.


## Customizing CSS styles

Right now, the easiest way to tweak `react-spreadsheet-table` is to create another stylesheet to override the default styles. For example, you could create a file named `react_spreadsheet_table_overrides.css` with the following contents:

```css
.SpreadsheetTable__cell_active {
    box-shadow: inset 0 0 0 2px green;
}
``` 

This would override the color of borders for the table active cell.

⚠️ The only exception, that you have to use `headerHeight` and `cellHeight` props to redefine height of the header and rows to not broke the scroll of the table.


## Customizing cells & header content

You can customize content of titles and cells using `title` and `value` keys of elements of the `columns` property. Setting these components using `row` and `{ active, focus, disabled }` parameters of the functions. 

`title` could be a string or a func returning any React element. 

`value` works the same way, but func receives current `row` and current state of the cell (`{ active, focused, disabled }`) as parameters, so you can create an outpur based on them.

For the basic usage, the library provide 2 default components that you can use out-of-the-box: `Input` and `Select`. Perhaps, they will be enough for you. However, you can use any other React components for that purpose: autocompletes, checkboxes, etc.

### Built-in Input

`Input` prop types: 

Prop | Type | Mission
--- | --- | ---
`value` | string | The value of the input
`placeholder` | string | Placeholder displaying when there is no value
`focus` | bool | Should the input has focus or not 
`onBlur` | func | Blur callback. Use it to catch a changed value

Usage:

```jsx
import { Table, Input } from 'react-spreadsheet-table'

 <Table 
    columns={[
      {
        title: () => {
            return <span>Name</span>
        }, 
        value: (row, { focus }) => {
          return (
            <Input  
              value={row.name}
              focus={focus}
              onBlur={this.onFieldChange.bind(this, 'name')}
            />
          );
        }
      }
   ]}
/>
```

### Built-in Select

`Select` prop types: 

Prop | Type | Mission
--- | --- | ---
`items` | arrayOf({ id: string / number, name: string }) | Items for select
`selectedId` | string / number | Id of a selected item
`placeholder` | string | Placeholder displaying when there is no selected item
`isOpen` | bool | Should the select be open or not
`onChange` | func | Change item callback. Use it to catch a changed value

Usage:

```jsx
import { Table, Select } from 'react-spreadsheet-table'

const positions = [{
    id: 1,
    name: 'Frontend developer'
}, {
    id: 2,
    name: 'Backend developer'
}];

 <Table 
    columns={[
      {
        title: () => {
            return <span>Position</span>
        }, 
        value: (row, { focus }) => {
          return (
            <Select
              items={positions}
              selectedId={row.positionId}
              isOpen={focus}
              onChange={this.onFieldChange.bind(this, 'positionId')}
            />
          );
        }
      }
   ]}
/>
```

### Another component

Let's suggest you need to use an autocomplete as a content of a cell. This is how it could be done:

```jsx
import { Table } from 'react-spreadsheet-table'
import AwesomeAutocomplete from 'awesome-autocomplete'

 <Table 
    columns={[
      {
        title: () => {
            return <span>Manager</span>
        }, 
        value: (row, { focus }) => {
          return (
            <AwesomeAutocomplete
              value={row.manager.name}
              selectedId={row.positionId}
              isOpen={focus}
              onSelectItem={this.onFieldChange.bind(this, 'manager')}
            />
          );
        }
      }
   ]}
/>
```

## Performant scrolling

`react-spreadsheet-table` always renders only the rows that are visible for the user. Therefore, you can pass to it as many rows as you want - it will work fine without any problems with rendering and scroll.

## Disabled cells
