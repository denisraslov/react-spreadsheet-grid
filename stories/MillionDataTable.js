import React from 'react';

import { storiesOf } from '@storybook/react';

import SpreadsheetTable from './../src/scrollWrapper';

const rows = [];

for (let i = 0; i < 1000; i++) {
    rows.push({
        id: i,
        firstName: 'John',
        secondName: 'Doe',
        position: 'Manager'
    });
}

storiesOf('Examples 2', module)
  .add('Data table with 1 000 000 rows', () => <div className="DataTable">
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
              }
          ]}
          rows={rows}
          getRowKey={row => row.id}
          cellHeight={80}
      />
  </div>);