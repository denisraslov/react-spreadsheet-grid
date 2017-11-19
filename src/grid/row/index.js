import React from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash.isequal';

import SpreadsheetCell from './cell';

class SpreadsheetRow extends React.Component {

    shouldComponentUpdate(nextProps) {
        const currentActiveCell = this.props.activeCell || this.props.focusedCell;
        const nextActiveCell = nextProps.activeCell || nextProps.focusedCell;

        return this.props.x !== nextProps.x
            || (currentActiveCell && currentActiveCell.x === this.props.x)
            || (nextActiveCell && nextActiveCell.x === this.props.x)
            || this.props.disabledCells !== nextProps.disabledCells
            || this.props.columnWidthValues !== nextProps.columnWidthValues;
    }

    render() {
        const {
            x,
            columns,
            row,
            onCellClick,
            onCellDoubleClick,
            getCellClassName,
            activeCell,
            focusedCell,
            columnWidthValues
        } = this.props;

        return (
            <div
                className="SpreadsheetGrid__row"
            >
                {
                    columns.map((column, y) => {
                        const coords = { x, y };
                        const disabled = !!this.props.disabledCells.find((cell) => {
                            return cell.x === x && cell.y === y;
                        });

                        return (
                            <SpreadsheetCell
                                x={x}
                                y={y}
                                key={y}
                                className={getCellClassName(column, row, x, y)}
                                onClick={!disabled ? onCellClick.bind(this, x, y, row, column.id) : null}
                                onDoubleClick={!disabled ? onCellDoubleClick.bind(this, x, y) : null}
                                isActive={isEqual(activeCell, coords)}
                                isFocused={isEqual(focusedCell, coords)}
                                disabledCells={this.props.disabledCells}
                                width={columnWidthValues[column.id]}
                                height={this.props.height}
                            >
                                {
                                    column.value(row, {
                                        active: isEqual(activeCell, coords),
                                        focus: isEqual(focusedCell, coords),
                                        disabled
                                    })
                                }
                            </SpreadsheetCell>
                        );
                    })
                }
            </div>
        );
    }
}

SpreadsheetRow.propTypes = {
    x: PropTypes.number.isRequired,
    columns: PropTypes.array.isRequired,
    row: PropTypes.object.isRequired,
    onCellClick: PropTypes.func,
    onCellDoubleClick: PropTypes.func,
    activeCell: PropTypes.object,
    focusedCell: PropTypes.object,
    getCellClassName: PropTypes.func,
    disabledCells: PropTypes.arrayOf(PropTypes.object),
    height: PropTypes.number,
    columnWidthValues: PropTypes.object
};

export default SpreadsheetRow;
