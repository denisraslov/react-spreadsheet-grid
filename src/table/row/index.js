import React from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import SpreadsheetCell from './cell';

class SpreadsheetRow extends React.PureComponent {

    shouldComponentUpdate(nextProps) {
        const currentActiveCell = this.props.activeCell || this.props.focusedCell;
        const nextActiveCell = nextProps.activeCell || nextProps.focusedCell;

        return this.props.x !== nextProps.x
            || (currentActiveCell && currentActiveCell.x === this.props.x)
            || (nextActiveCell && nextActiveCell.x === this.props.x)
            || this.props.disabledCells !== nextProps.disabledCells;
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
            disabled
        } = this.props;

        return (
            <tr style={{ height: this.props.height }}>
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
            </tr>
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
    disabled: PropTypes.bool,
    disabledCells: PropTypes.bool,
    height: PropTypes.number
};

export default SpreadsheetRow;
