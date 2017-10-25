import React from 'react';

import { storiesOf } from '@storybook/react';

import SpreadsheetTable from './../src/scrollWrapper';

const rows = [];

for (let i = 0; i < 130; i++) {
    rows.push({
        id: i,
        firstName: 'First name ' + i,
        secondName: 'Second name ' + i,
        position: 'Position ' + i,
        age: i
    });
}

storiesOf('Examples 1', module)
  .add('Data table', () => <div className="DataTable">
      <SpreadsheetTable
          columns={[
              {
                  title: 'First name',
                  value: (row, { active, focus }) => {
                      return row.firstName;
                  },
                  id: 'firstName'
              },
              {
                  title: 'Second name',
                  value: (row, { active, focus }) => {
                      return row.secondName;
                  },
                  id: 'secondName'
              },
              {
                  title: 'Position',
                  value: (row, { active, focus }) => {
                      return row.position;
                  },
                  id: 'position'
              },
              {
                  title: 'Age',
                  value: (row, { active, focus }) => {
                      return row.age;
                  },
                  id: 'age'
              }
          ]}
          rows={rows}
          getRowKey={row => row.id}
          cellHeight={50}
      />
  </div>);