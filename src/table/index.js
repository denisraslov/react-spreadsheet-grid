import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import _ from 'lodash';
import keys from './../kit/keymap';
import Row from './row';

import './styles.css';

class SpreadsheetTable extends React.PureComponent {
    constructor(props) {
        super(props);

        this.onGlobalKeyDown = this.onGlobalKeyDown.bind(this);
        this.onGlobalClick = this.onGlobalClick.bind(this);
        this.onCellClick = this.onCellClick.bind(this);
        this.onCellDoubleClick = this.onCellDoubleClick.bind(this);
        this.getCellClassName = this.getCellClassName.bind(this);

        this.state = {
            disabledCells: this.getDisabledCells(this.props.rows, this.props.checkDisabledCell)
        };

        if (this.props.isFirstCellFocused) {
            this.state.activeCell = { x: 0, y: 0 };
            this.state.focusedCell = { x: 0, y: 0 };

            this.skipGlobalClick = true;
        }
    }

    getDisabledCells(rows, checkDisabledCell) {
        const disabledCells = [];

        if (checkDisabledCell) {
            rows.forEach((row, x) => {
                this.props.columns.forEach((column, y) => {
                    if (checkDisabledCell(row, column.id)) {
                        disabledCells.push({ x, y });
                    }
                });
            });
        }

        return disabledCells;
    }

    componentWillReceiveProps(newProps) {
        if (!newProps.focus) {
            this.setState({
                focusedCell: null
            });
        }

        if (this.props.rows !== newProps.rows && newProps.checkDisabledCell) {
            const disabledCells = this.getDisabledCells(newProps.rows, newProps.checkDisabledCell);
            const newState = {
                disabledCells
            };

            if (_.find(disabledCells, this.state.activeCell)) {
                newState.activeCell = null;
            }
            if (_.find(disabledCells, this.state.focusedCell)) {
                newState.focusedCell = null;
            }

            this.setState(newState);
        }

        if (newProps.isFirstCellFocused) {
            const newActiveCell = { x: 0, y: 0 };

            this.setState({
                activeCell: newActiveCell,
                focusedCell: newActiveCell
            });
            this.skipGlobalClick = true;
        }
    }

    componentDidUpdate() {
        document.removeEventListener('keydown', this.onGlobalKeyDown, false);
        document.addEventListener('keydown', this.onGlobalKeyDown, false);
    }

    componentDidMount() {
        document.addEventListener('keydown', this.onGlobalKeyDown, false);
        document.addEventListener('click', this.onGlobalClick, false);
    }

    componentWillUnmount() {
        document.removeEventListener('keydown', this.onGlobalKeyDown, false);
        document.removeEventListener('click', this.onGlobalClick, false);
    }

    onGlobalKeyDown(e) {
        if (!e.skipExcelGlobalKeyDown) {
            const block = this;
            const columnsCount = this.props.columns.length;
            const rowsCount = this.props.rows.length;

            let newActiveCell = this.state.activeCell;
            let newFocusedCell = this.state.focusedCell;

            if (this.state.activeCell) {
                const { x, y } = this.state.activeCell;

                newFocusedCell = this.state.activeCell;

                function moveRight({ x, y }) {
                    if (y < columnsCount - 1) {
                        newActiveCell = { x, y: y + 1 };
                    } else if (x < rowsCount - 1) {
                        newActiveCell = { x: x + 1, y: 0 };
                    }
                    newFocusedCell = null;

                    if (_.find(block.state.disabledCells, newActiveCell)) {
                        moveRight(newActiveCell);
                    }
                }

                function moveDown({ x, y }) {
                    if (x < rowsCount - 1) {
                        newActiveCell = { x: x + 1, y };
                    }
                    newFocusedCell = null;

                    if (_.find(block.state.disabledCells, newActiveCell)) {
                        moveDown(newActiveCell);
                    }
                }

                function moveUp({ x, y }) {
                    if (x > 0) {
                        newActiveCell = { x: x - 1, y };
                    }
                    newFocusedCell = null;

                    if (_.find(block.state.disabledCells, newActiveCell)) {
                        moveUp(newActiveCell);
                    }
                }

                function moveLeft({ x, y }) {
                    if (y > 0) {
                        newActiveCell = { x, y: y - 1 };
                    } else if (x > 0) {
                        newActiveCell = { x: x - 1, y: columnsCount - 1 };
                    }
                    newFocusedCell = null;

                    if (_.find(block.state.disabledCells, newActiveCell)) {
                        moveLeft(newActiveCell);
                    }
                }

                if (!this.state.focusedCell) {
                    if (e.keyCode === keys.RIGHT) {
                        moveRight({ x, y });
                    }

                    if (e.keyCode === keys.LEFT) {
                        moveLeft({ x, y });
                    }

                    if (e.keyCode === keys.UP) {
                        e.preventDefault();
                        moveUp({ x, y });
                    }

                    if (e.keyCode === keys.DOWN) {
                        e.preventDefault();
                        moveDown({ x, y });
                    }

                    if (e.keyCode === keys.ALT) {
                        newFocusedCell = null;
                    }
                }

                if (e.keyCode === keys.ENTER) {
                    if (this.state.focusedCell) {
                        moveDown({ x, y });
                        e.target.blur();
                    } else {
                        newFocusedCell = this.state.activeCell;
                    }
                }

                if (e.keyCode === keys.TAB) {
                    if (this.state.focusedCell) {
                        moveRight({ x, y });
                        e.target.blur();
                    } else {
                        newFocusedCell = this.state.activeCell;
                    }

                    e.preventDefault();
                }

                if (e.keyCode === keys.ESC) {
                    if (this.state.focusedCell) {
                        e.target.blur();
                        newFocusedCell = null;
                    }
                }

                this.setState({
                    activeCell: newActiveCell,
                    focusedCell: newFocusedCell
                });
            }
        }
    }

    onGlobalClick() {
        if (!this.skipGlobalClick) {
            this.setState({
                activeCell: null,
                focusedCell: null
            });
        } else {
            this.skipGlobalClick = false;
        }
    }

    onCellClick(x, y, row, columnId, e) {
        if (!_.find(this.state.disabledCells, { x, y })) {
            if (!e.skipCellClick && !_.isEqual(this.state.focusedCell, { x, y })) {
                this.setState({
                    focusedCell: e.target !== e.currentTarget ? { x, y } : null,
                    activeCell: { x, y }
                });
            }
        }

        if (this.props.onCellClick) {
            this.props.onCellClick(row, columnId);
        }

        this.skipGlobalClick = true;
    }

    onCellDoubleClick(x, y) {
        if (!_.find(this.state.disabledCells, { x, y })) {
            this.setState({
                activeCell: { x, y },
                focusedCell: { x, y }
            });
        }
    }

    getCellClassName(column, row, x, y) {
        return classnames(
            'SpreadsheetTable__cell',
            _.isEqual(this.state.activeCell, { x, y }) && 'SpreadsheetTable__cell_active',
            _.isEqual(this.state.focusedCell, { x, y }) && 'SpreadsheetTable__cell_focused',
            this.props.checkDisabledCell && this.props.checkDisabledCell(row, column.id)
                && 'SpreadsheetTable__cell_disabled'
        );
    }

    renderHeader() {
        const columns = this.props.columns;

        return (
            <thead
                style={{visibility: `${this.props.first > 0 ? 'hidden' : 'visible'}`}}
            >
            <tr>
                {
                    columns.map((column, i) => {
                        return (
                            <th
                                key={i}
                            >
                                {typeof column.title === 'string' ? column.title : column.title()}
                            </th>
                        );
                    })
                }
            </tr>
            </thead>
        );
    }

    renderBody() {
        const rows = [].concat(_.slice(this.props.rows, this.props.first, this.props.last));
        const columns = this.props.columns;
        let body;

        if (rows.length) {
            body = rows.map((row) => {
                return (
                    <Row
                        x={_.findIndex(this.props.rows, row)}
                        key={this.props.getRowKey(row)}
                        columns={columns}
                        row={row}
                        getCellClassName={this.getCellClassName}
                        onCellClick={this.onCellClick}
                        onCellDoubleClick={this.onCellDoubleClick}
                        activeCell={this.state.activeCell}
                        focusedCell={this.state.focusedCell}
                        disabledCells={this.state.disabledCells}
                    />
                );
            });
        } else {
            body = (
                <tr className="SpreadsheetTable__placeholder">
                    <td colSpan={columns.length}>
                        <div>
                            {this.props.placeholder}
                        </div>
                    </td>
                </tr>
            );
        }

        return body;
    }

    render() {
        return (
            <table
                className="SpreadsheetTable"
                style={{ transform: `translateY(${this.props.position})` }}
            >
                {this.renderHeader()}
                <tbody>
                    {this.renderBody()}
                </tbody>
            </table>
        );
    }
}

SpreadsheetTable.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            title: PropTypes.func.isRequired,
            value: PropTypes.func.isRequired
        })
    ).isRequired,
    rows: PropTypes.arrayOf(PropTypes.object),
    placeholder: PropTypes.string.isRequired,
    getRowKey: PropTypes.func.isRequired,
    getCellClassName: PropTypes.func,
    checkDisabledCell: PropTypes.func,
    isFirstCellFocused: PropTypes.bool,
    onCellClick: PropTypes.func,
    first: PropTypes.number,
    last: PropTypes.number,
    position: PropTypes.string
};

SpreadsheetTable.defaultProps = {
    rows: []
};

export default SpreadsheetTable;
