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
        this.startColumnResize = this.startColumnResize.bind(this);
        this.processColumnResize = this.processColumnResize.bind(this);
        this.onWindowResize = this.onWindowResize.bind(this);

        this.state = {
            disabledCells: this.getDisabledCells(this.props.rows, this.props.checkDisabledCell),
            widthValues: {}
        };

        if (this.props.focusedCell) {
            this.state.activeCell = this.props.focusedCell;
            this.state.focusedCell = this.props.focusedCell;

            this.skipGlobalClick = true;
        }
    }

    componentDidMount() {
        if (this.props.columnsResize) {
            this.freezeTable(this.props.widthValues);

            window.addEventListener('resize', this.onWindowResize, false);
            document.addEventListener('mousemove', this.processColumnResize, false);
            document.addEventListener('mouseup', () => {
                this.resizingCell = null;
            }, false);
        }

        document.addEventListener('keydown', this.onGlobalKeyDown, false);
        document.addEventListener('click', this.onGlobalClick, false);
    }

    componentWillReceiveProps(newProps) {
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

        if (newProps.focusedCell) {
            const newActiveCell = newProps.focusedCell;

            this.setState({
                activeCell: newActiveCell,
                focusedCell: newActiveCell
            });
            this.skipGlobalClick = true;
        }

        if (newProps.blurFocus) {
            this.setState({
                focusedCell: null
            });
        }
    }

    componentDidUpdate() {
        document.removeEventListener('keydown', this.onGlobalKeyDown, false);
        document.addEventListener('keydown', this.onGlobalKeyDown, false);
    }

    componentWillUnmount() {
        if (this.props.columnsResize) {
            window.removeEventListener('resize', this.onWindowResize, false);
            document.removeEventListener('mousemove', this.processColumnResize, false);
            document.removeEventListener('mouseup', () => {
                this.resizingCell = null;
            }, false);
        }

        document.removeEventListener('keydown', this.onGlobalKeyDown, false);
        document.removeEventListener('click', this.onGlobalClick, false);
    }

    onWindowResize() {
        this.freezeTable();
    }

    freezeTable(widthValues = {}) {
        const table = this.tableElement;

        // There is no table when Jest is running tests
        if (table) {
            const cells = table.querySelectorAll('.SpreadsheetTable__headCell');
            const preparedWidthValues = {};
            let sumOfWidth = 0;

            Object.keys(widthValues).forEach((id) => {
                sumOfWidth += widthValues[id];
            });

            if (sumOfWidth > 100) {
                console.error('react-spreadsheet-grid ERROR: The sum of column width values in ' +
                    'the "widthValues" property is more then 100 percents! ' +
                    'The values are not being used in this condition!');
                widthValues = {};
            }

            let restTableWidth = 100;
            let restColumnsCount = cells.length;

            cells.forEach((cell, i) => {
                const id = this.props.columns[i].id;

                if (widthValues[id]) {
                    preparedWidthValues[id] = widthValues[id];
                    restTableWidth -= widthValues[id];
                    restColumnsCount--;
                } else {
                    preparedWidthValues[id] = (restTableWidth / cells.length);
                }
            });

            cells.forEach((cell, i) => {
                const id = this.props.columns[i].id;

                if (!widthValues[id]) {
                    preparedWidthValues[id] = (restTableWidth / cells.length);
                }
            });

            this.setState({
                widthValues: preparedWidthValues
            });
        }
    }

    startColumnResize(e) {
        this.resizingCell = e.currentTarget.offsetParent;
        this.resizingCell.startOffset = this.resizingCell.offsetWidth - e.pageX;

        this.nextResizingCell = this.resizingCell.nextSibling;
        this.nextResizingCell.startOffset =
            document.body.offsetWidth -
            this.nextResizingCell.offsetWidth -
            e.pageX;
    }

    processColumnResize(e, nextCell) {
        let direction;
        let sibling;
        const table = this.tableElement;
        const tableWidth = table.offsetWidth;
        const columns = this.props.columns;

        if (this.currentCoords <= e.pageX) {
            direction = 'toRight';
        }

        if (this.resizingCell) {
            const widthValues = Object.assign({}, this.state.widthValues);

            if (direction === 'toRight') {
                const diff = this.resizingCell.startOffset + e.pageX - this.resizingCell.offsetWidth;

                if (this.currentCoords) {
                    sibling = nextCell || this.resizingCell.nextSibling;
                }

                if (this.resizingCell.offsetWidth + diff > 100 &&
                    sibling.offsetWidth - diff > 100) {

                    const prevValue1 = widthValues[columns[this.resizingCell.dataset.index].id];
                    const newValue1 = (this.resizingCell.offsetWidth + diff) * 100 / tableWidth;

                    widthValues[columns[this.resizingCell.dataset.index].id] = newValue1;
                    widthValues[columns[sibling.dataset.index].id] -= newValue1 - prevValue1;

                    this.setState({
                        widthValues
                    });
                } else {
                    let cell;

                    if (nextCell) {
                        cell = nextCell.nextSibling;
                    } else {
                        cell = this.resizingCell.nextSibling.nextSibling;
                    }

                    if (cell) {
                        this.processColumnResize(e, cell);
                    }
                }
            } else {
                if (this.currentCoords) {
                    sibling = nextCell || this.resizingCell;
                }

                const diff = document.body.offsetWidth -
                    e.pageX -
                    this.nextResizingCell.startOffset -
                    this.nextResizingCell.offsetWidth;

                if (sibling.offsetWidth - diff > 100 &&
                    this.nextResizingCell.offsetWidth + diff > 100) {

                    const prevValue1 = widthValues[columns[sibling.dataset.index].id];
                    const newValue1 = (parseInt(sibling.offsetWidth, 10) - diff) * 100 / tableWidth;

                    widthValues[columns[sibling.dataset.index].id] = newValue1;
                    widthValues[columns[this.nextResizingCell.dataset.index].id] -= newValue1 - prevValue1;

                    this.setState({
                        widthValues
                    });

                } else {
                    let cell;

                    if (nextCell) {
                        cell = nextCell.previousSibling;
                    } else {
                        cell = this.resizingCell.previousSibling;
                    }

                    if (cell) {
                        this.processColumnResize(e, cell);
                    }
                }
            }

            if (this.props.onColumnResize) {
                this.props.onColumnResize(widthValues);
            }
        }

        this.currentCoords = e.pageX;
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

    onGlobalKeyDown(e) {
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

    calculatePosition() {
        return this.props.offset + (this.props.first > 0 ? this.props.headerHeight : 0) + 'px';
    }

    renderResizer() {
        return (
            <div
                className="SpreadsheetTable__resizer"
                onMouseDown={this.startColumnResize}
                style={{
                    height: this.props.headerHeight + 'px'
                }}
            />
        );
    }

    renderHeader() {
        const columns = this.props.columns;
        const { widthValues } = this.state;

        return (
            <div
                className="SpreadsheetTable__headed"
                style={{
                    display: `${this.props.first > 0 ? 'none' : ''}`,
                }}
            >
                {
                    columns.map((column, i) => {
                        return (
                            <div
                                className="SpreadsheetTable__headCell"
                                data-index={i}
                                style={{
                                    height: this.props.headerHeight + 'px',
                                    width: widthValues
                                        ? widthValues[columns[i].id] + '%'
                                        : 'auto'
                                }}
                            >
                                {typeof column.title === 'string' ? column.title : column.title()}
                                {this.props.columnsResize && this.renderResizer()}
                            </div>
                        );
                    })
                }
            </div>
        );
    }

    renderBody() {
        const rows = [].concat(_.slice(
            this.props.rows,
            this.props.first,
            this.props.last
        ));
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
                        height={this.props.cellHeight}
                        widthValues={this.state.widthValues}
                    />
                );
            });
        } else {
            body = (
                <div className="SpreadsheetTable__placeholder">
                    {this.props.placeholder}
                </div>
            );
        }

        return body;
    }

    render() {
        return (
            <div
                className="SpreadsheetTable"
                style={{
                    top: this.calculatePosition()
                }}
                ref={(tableElement) => { this.tableElement = tableElement; }}
            >
                {this.renderHeader()}
                <div>
                    {this.renderBody()}
                </div>
            </div>
        );
    }
}

export const propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            title: PropTypes.func.isRequired,
            value: PropTypes.func.isRequired
        })
    ).isRequired,
    rows: PropTypes.arrayOf(PropTypes.any),
    getRowKey: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    checkDisabledCell: PropTypes.func,
    focusedCell: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
    }),
    onCellClick: PropTypes.func,
    blurFocus: PropTypes.bool,

    // scroll
    headerHeight: PropTypes.number,
    cellHeight: PropTypes.number,
    first: PropTypes.number,
    last: PropTypes.number,
    offset: PropTypes.number,

    // resize
    columnsResize: PropTypes.bool,
    onColumnResize: PropTypes.func,
    widthValues: PropTypes.object
};

SpreadsheetTable.defaultProps = {
    blurFocus: false
};

SpreadsheetTable.propTypes = propTypes;

export default SpreadsheetTable;
