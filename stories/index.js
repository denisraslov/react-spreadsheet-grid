import React from 'react';

import { storiesOf } from '@storybook/react';

import SpreadsheetTable from './../src/scrollWrapper';

storiesOf('SpreadsheetTable', module)
  .add('not editable', () => <SpreadsheetTable
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
              title: 'Photo',
              value: (row, { active, focus }) => {
                  return <img src={row.photo} />;
              },
              id: 'photo'
          }
      ]}
      rows={[
          {
              id: 1,
              firstName: 'John',
              secondName: 'Doe',
              position: 'Manager',
              photo: 'https://randomuser.me/api/portraits/thumb/men/83.jpg'
          },
          {
              id: 2,
              firstName: 'John',
              secondName: 'Doe',
              position: 'Manager',
              photo: 'https://randomuser.me/api/portraits/thumb/men/83.jpg'
          },
          {
              id: 3,
              firstName: 'John',
              secondName: 'Doe',
              position: 'Manager',
              photo: 'https://randomuser.me/api/portraits/thumb/men/83.jpg'
          },
          {
              id: 4,
              firstName: 'John',
              secondName: 'Doe',
              position: 'Manager',
              photo: 'https://randomuser.me/api/portraits/thumb/men/83.jpg'
          },
          {
              id: 5,
              firstName: 'John',
              secondName: 'Doe',
              position: 'Manager',
              photo: 'https://randomuser.me/api/portraits/thumb/men/83.jpg'
          },
          {
              id: 6,
              firstName: 'John',
              secondName: 'Doe',
              position: 'Manager',
              photo: 'https://randomuser.me/api/portraits/med/men/83.jpg'
          },
          {
              id: 7,
              firstName: 'John',
              secondName: 'Doe',
              position: 'Manager',
              photo: 'https://randomuser.me/api/portraits/thumb/men/83.jpg'
          },
          {
              id: 8,
              firstName: 'John',
              secondName: 'Doe',
              position: 'Manager',
              photo: 'https://randomuser.me/api/portraits/thumb/men/83.jpg'
          },
          {
              id: 9,
              firstName: 'John',
              secondName: 'Doe',
              position: 'Manager',
              photo: 'https://randomuser.me/api/portraits/thumb/men/83.jpg'
          },
          {
              id: 10,
              firstName: 'John',
              secondName: 'Doe',
              position: 'Manager',
              photo: 'https://randomuser.me/api/portraits/thumb/men/83.jpg'
          }
      ]}
      getRowKey={row => row.id}
      cellHeight={100}
      columnsResize
  />);