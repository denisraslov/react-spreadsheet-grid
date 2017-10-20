# react-spreadsheet-table
A light Spreadsheet Table component for React

## The key features

This is an Excel-like Spreadsheet Table component that supports:

> ✅  control by mouse & from keyboard (⬅️ ⬆️ ⬇️ ➡️)

> ✅  any other components as a content of the cells & column titles

> ✅  smart (fast) render & scroll for as many rows as you need

> ✅  columns width resize

> ✅  custom CSS-styles

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

> `arrayOf(shape)` | defaults to `[]`
