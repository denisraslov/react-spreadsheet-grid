import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import SpreadsheetCell from './cell';

class SpreadsheetRow extends React.Component {

    shouldComponentUpdate(nextProps) {
        const currentActiveCell = this.props.activeCell || this.props.focusedCell;
        const nextActiveCell = nextProps.activeCell || nextProps.focusedCell;

        return this.props.x !== nextProps.x
            || (currentActiveCell && currentActiveCell.x === this.props.x)
            || (nextActiveCell && nextActiveCell.x === this.props.x)
            || this.props.disabledCells !== nextProps.disabledCells
            || this.props.widthValues !== nextProps.widthValues;
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
            widthValues
        } = this.props;

        return (
            <div
                className="SpreadsheetTable__row"
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
                                onClick={!disabled && onCellClick.bind(this, x, y, row, column.id)}
                                onDoubleClick={!disabled && onCellDoubleClick.bind(this, x, y)}
                                isActive={_.isEqual(activeCell, coords)}
                                isFocused={_.isEqual(focusedCell, coords)}
                                disabledCells={this.props.disabledCells}
                                width={widthValues[column.id]}
                                height={this.props.height}
                            >
                                {
                                    column.value(row, {
                                        active: _.isEqual(activeCell, coords),
                                        focus: _.isEqual(focusedCell, coords),
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
    widthValues: PropTypes.object
};

export default SpreadsheetRow;
