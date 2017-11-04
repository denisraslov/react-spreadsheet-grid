import React from 'react';

import { storiesOf } from '@storybook/react';

import { Table, Input } from './../index';

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

class DataTable extends React.PureComponent {

    constructor(props) {
        super(props);

        this.state = {
            rows
        };
    }

    onFieldChange(rowId, field, value) {
        rows[rowId][field] = value;

        this.setState({
            rows: [].concat(rows)
        });
    }

    render() {
        return (
            <div className="DataTable">
                <Table
                    columns={[
                        {
                            title: 'First name',
                            value: (row, {focus}) => {
                                return (
                                    <Input
                                        value={row.firstName}
                                        focus={focus}
                                        onBlur={this.onFieldChange.bind(this, row.id, 'firstName')}
                                    />
                                );
                            },
                            id: 'firstName'
                        },
                        {
                            title: 'Second name',
                            value: (row, {focus}) => {
                                return (
                                    <Input
                                        value={row.secondName}
                                        focus={focus}
                                        onBlur={this.onFieldChange.bind(this, row.id, 'secondName')}
                                    />
                                );
                            },
                            id: 'secondName'
                        },
                        {
                            title: 'Position',
                            value: (row, {focus}) => {
                                return (
                                    <Input
                                        value={row.position}
                                        focus={focus}
                                        onBlur={this.onFieldChange.bind(this, row.id, 'position')}
                                    />
                                );
                            },
                            id: 'position'
                        },
                        {
                            title: 'Age',
                            value: (row, {focus}) => {
                                return (
                                    <Input
                                        value={row.age}
                                        focus={focus}
                                        onBlur={this.onFieldChange.bind(this, row.id, 'age')}
                                    />
                                );
                            },
                            id: 'age'
                        }
                    ]}
                    rows={rows}
                    getRowKey={row => row.id}
                    cellHeight={50}
                />
            </div>
        )
    }
}

storiesOf('Examples 1', module)
    .add('Data table', () => <DataTable />);