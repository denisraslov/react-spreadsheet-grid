import React from 'react'
import PropTypes from 'prop-types'
import isEqual from 'lodash.isequal'

import SpreadsheetCell from './cell'

class SpreadsheetRow extends React.Component {
  shouldComponentUpdate(nextProps) {
    const currentActiveCell = this.props.activeCell
    const nextActiveCell = nextProps.activeCell
    const currentFocusedCell = this.props.focusedCell
    const nextFocusedCell = nextProps.focusedCell

    const isActiveCellChanged =
      (currentActiveCell && !nextActiveCell) ||
      (!currentActiveCell && nextActiveCell) ||
      (currentActiveCell &&
        nextActiveCell &&
        (currentActiveCell.x !== nextActiveCell.x ||
          currentActiveCell.y !== nextActiveCell.y))

    const isFocusedCellChanged =
      (currentFocusedCell && !nextFocusedCell) ||
      (!currentFocusedCell && nextFocusedCell) ||
      (currentFocusedCell &&
        nextFocusedCell &&
        (currentFocusedCell.x !== nextFocusedCell.x ||
          currentFocusedCell.y !== nextFocusedCell.y))

    return (
      this.props.row !== nextProps.row ||
      this.props.x !== nextProps.x ||
      JSON.stringify(this.props.disabledCells) !==
        JSON.stringify(nextProps.disabledCells) ||
      this.props.columns !== nextProps.columns ||
      this.props.columnWidthValues !== nextProps.columnWidthValues ||
      (!!isActiveCellChanged &&
        ((currentActiveCell && currentActiveCell.x === this.props.x) ||
          (nextActiveCell && nextActiveCell.x === this.props.x))) ||
      (!!isFocusedCellChanged &&
        ((currentFocusedCell && currentFocusedCell.x === this.props.x) ||
          (nextFocusedCell && nextFocusedCell.x === this.props.x)))
    )
  }

  render() {
    const {
      x,
      height,
      columns,
      row,
      onCellClick,
      onCellDoubleClick,
      getCellClassName,
      activeCell,
      focusedCell,
      columnWidthValues,
    } = this.props

    return (
      <div
        className='SpreadsheetGrid__row'
        style={{
          height: height + 'px',
        }}
      >
        {columns.map((column, y) => {
          const coords = { x, y }
          const disabled = !!this.props.disabledCells.find((cell) => {
            return cell.x === x && cell.y === y
          })

          return (
            <SpreadsheetCell
              y={y}
              key={y}
              className={getCellClassName(column, row, x, y)}
              onClick={
                !disabled ? onCellClick.bind(this, x, y, row, column.id) : null
              }
              onDoubleClick={
                !disabled ? onCellDoubleClick.bind(this, x, y) : null
              }
              width={columnWidthValues[column.id]}
            >
              {column.value(row, {
                active: isEqual(activeCell, coords),
                focus: isEqual(focusedCell, coords),
                disabled,
              })}
            </SpreadsheetCell>
          )
        })}
      </div>
    )
  }
}

SpreadsheetRow.propTypes = {
  x: PropTypes.number.isRequired,
  columns: PropTypes.array.isRequired,
  row: PropTypes.any.isRequired,
  onCellClick: PropTypes.func,
  onCellDoubleClick: PropTypes.func,
  activeCell: PropTypes.object,
  focusedCell: PropTypes.object,
  getCellClassName: PropTypes.func,
  disabledCells: PropTypes.arrayOf(PropTypes.object),
  height: PropTypes.number,
  columnWidthValues: PropTypes.object,
}

export default SpreadsheetRow
