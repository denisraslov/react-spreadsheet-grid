import React from 'react'
import PropTypes from 'prop-types'
import Grid from '../grid'
import ScrollDummy from './../scrollDummy'
import slice from 'lodash.slice'
import throttleWithRAF from './../kit/throttleWithRAF'
import tablePropTypes from './../kit/tablePropTypes'
import styles from './styles.css'

const RESERVE_ROWS_COUNT = 3

class SpreadsheetGridScrollWrapper extends React.PureComponent {
  constructor(props) {
    super(props)

    this.onScroll = this.onScroll.bind(this)
    this.onResize = this.onResize.bind(this)
    this.setScrollState = this.setScrollState.bind(this)
    this.startColumnResize = this.startColumnResize.bind(this)
    this.processColumnResize = this.processColumnResize.bind(this)

    this.tableEl = React.createRef()
    this.scrollDummyEl = React.createRef()
    this.scrollWrapperEl = React.createRef()
    this.grid = React.createRef()

    this.state = {
      first: 0,
      last: this.calculateInitialLast(),
      offset: 0,
      columnWidthValues: {},
    }

    // if requestAnimationFrame is available, use it to throttle refreshState
    if (typeof window !== 'undefined' && 'requestAnimationFrame' in window) {
      this.setScrollState = throttleWithRAF(this.setScrollState)
    }
  }

  componentDidMount() {
    this.freezeTable()

    if (this.props.isColumnsResizable) {
      document.addEventListener('mousemove', this.processColumnResize, false)
      document.addEventListener(
        'mouseup',
        () => {
          this.resizingCell = null
        },
        false
      )
    }

    window.addEventListener('resize', this.onResize, false)

    this.setScrollState()
  }

  componentDidUpdate(prevProps) {
    const { columns, rows } = this.props

    // If columns has been changed, recalculate their width values.
    if (prevProps.columns !== columns) {
      this.freezeTable()
    }
    if (rows !== prevProps.rows) {
      this.setScrollState()
    }
  }

  componentWillUnmount() {
    if (this.props.isColumnsResizable) {
      document.removeEventListener('mousemove', this.processColumnResize, false)
      document.removeEventListener(
        'mouseup',
        () => {
          this.resizingCell = null
        },
        false
      )
    }

    window.removeEventListener('resize', this.onResize, false)
  }

  resetScroll() {
    this.scrollWrapperEl.current.scrollTop = 0
    this.setScrollState()
  }

  focusCell(nextFocusedCell) {
    this.grid.current.focusCell(nextFocusedCell)
  }

  freezeTable() {
    const table = this.tableEl.current

    // There is no grid when Jest is running tests
    if (table) {
      const cells = table.querySelectorAll('.SpreadsheetGrid__headCell')
      const { columns } = this.props
      let columnWidthValues = columns.reduce((widths, column) => {
        widths[column.id] = column.width
        return widths
      }, {})

      let sumOfWidth = 0

      Object.keys(columnWidthValues).forEach((id) => {
        sumOfWidth += columnWidthValues[id]
      })

      if (Math.round(sumOfWidth) > 100) {
        console.error(
          'react-spreadsheet-grid ERROR: The sum of column width values in ' +
            'the "columnWidthValues" property is more then 100 percents! ' +
            'The values are not being used in this condition!'
        )
        columnWidthValues = {}
      }

      let restTableWidth = 100
      let restColumnsCount = cells.length
      const preparedColumnWidthValues = {}

      cells.forEach((cell, i) => {
        const id = this.props.columns[i].id

        if (columnWidthValues[id]) {
          preparedColumnWidthValues[id] = columnWidthValues[id]
          restTableWidth -= columnWidthValues[id]
          restColumnsCount--
        }
      })

      cells.forEach((cell, i) => {
        const id = this.props.columns[i].id

        if (!columnWidthValues[id]) {
          preparedColumnWidthValues[id] = restTableWidth / restColumnsCount
        }
      })

      this.setState({
        columnWidthValues: preparedColumnWidthValues,
      })
    }
  }

  startColumnResize(e) {
    this.resizingCell = e.currentTarget.offsetParent
    this.resizingCell.startOffset = this.resizingCell.offsetWidth - e.pageX

    this.nextResizingCell = this.resizingCell.nextSibling
    this.nextResizingCell.startOffset =
      document.body.offsetWidth - this.nextResizingCell.offsetWidth - e.pageX
  }

  processColumnResize(e, nextCell) {
    let direction
    let sibling
    const table = this.tableEl.current
    const tableWidth = table.offsetWidth
    const columns = this.props.columns

    if (this.currentCoords <= e.pageX) {
      direction = 'toRight'
    }

    if (this.resizingCell) {
      const columnWidthValues = Object.assign({}, this.state.columnWidthValues)

      if (direction === 'toRight') {
        const diff =
          this.resizingCell.startOffset +
          e.pageX -
          this.resizingCell.offsetWidth

        if (this.currentCoords) {
          sibling = nextCell || this.resizingCell.nextSibling
        }

        if (
          this.resizingCell.offsetWidth + diff > 100 &&
          sibling.offsetWidth - diff > 100
        ) {
          const prevValue1 =
            columnWidthValues[columns[this.resizingCell.dataset.index].id]
          const newValue1 =
            ((this.resizingCell.offsetWidth + diff) * 100) / tableWidth

          columnWidthValues[columns[this.resizingCell.dataset.index].id] =
            newValue1
          columnWidthValues[columns[sibling.dataset.index].id] -=
            newValue1 - prevValue1

          this.setState({
            columnWidthValues,
          })
        } else {
          let cell

          if (nextCell) {
            cell = nextCell.nextSibling
          } else {
            cell = this.resizingCell.nextSibling.nextSibling
          }

          if (cell) {
            this.processColumnResize(e, cell)
          }
        }
      } else {
        if (this.currentCoords) {
          sibling = nextCell || this.resizingCell
        }

        const diff =
          document.body.offsetWidth -
          e.pageX -
          this.nextResizingCell.startOffset -
          this.nextResizingCell.offsetWidth

        if (
          sibling.offsetWidth - diff > 100 &&
          this.nextResizingCell.offsetWidth + diff > 100
        ) {
          const prevValue1 =
            columnWidthValues[columns[sibling.dataset.index].id]
          const newValue1 =
            ((parseInt(sibling.offsetWidth, 10) - diff) * 100) / tableWidth

          columnWidthValues[columns[sibling.dataset.index].id] = newValue1
          columnWidthValues[columns[this.nextResizingCell.dataset.index].id] -=
            newValue1 - prevValue1

          this.setState({
            columnWidthValues,
          })
        } else {
          let cell

          if (nextCell) {
            cell = nextCell.previousSibling
          } else {
            cell = this.resizingCell.previousSibling
          }

          if (cell) {
            this.processColumnResize(e, cell)
          }
        }
      }

      if (this.props.onColumnResize) {
        this.props.onColumnResize(columnWidthValues)
      }
    }

    this.currentCoords = e.pageX
  }

  calculateInitialLast() {
    return this.props.isScrollable
      ? Math.ceil(window.outerHeight / this.props.rowHeight) +
          RESERVE_ROWS_COUNT
      : this.props.rows.length
  }

  calculateLast(first) {
    const wrapper = this.scrollWrapperEl.current
    const visibleHeight = wrapper ? wrapper.parentNode.offsetHeight + 200 : 0

    return first + Math.ceil(visibleHeight / this.props.rowHeight)
  }

  setScrollState() {
    const scrollWrapperEl = this.scrollWrapperEl.current
    const scrollDummyEl = this.scrollDummyEl.current
    const rows = this.props.rows

    if (!this.props.isScrollable) {
      return
    }

    const scrollTop = Math.max(scrollWrapperEl.scrollTop, 0)
    const first = Math.max(
      0,
      Math.floor(scrollTop / this.props.rowHeight) - RESERVE_ROWS_COUNT
    )
    const last = Math.min(
      rows.length,
      this.calculateLast(first) + RESERVE_ROWS_COUNT
    )
    let newState = {
      hasScroll:
        scrollWrapperEl.scrollHeight > scrollWrapperEl.offsetHeight &&
        // Check if the scroll has a width
        scrollWrapperEl.offsetWidth > scrollDummyEl.offsetWidth,
    }

    if (first !== this.state.first || last !== this.state.last) {
      newState = {
        ...newState,
        ...{
          first,
          last,
          offset: first * this.props.rowHeight,
        },
      }
    }
    this.setState(newState)

    if (this.props.onScroll) {
      this.props.onScroll(scrollTop)
    }

    if (
      this.props.onScrollReachesBottom &&
      scrollWrapperEl.offsetHeight + scrollWrapperEl.scrollTop >=
        scrollWrapperEl.scrollHeight
    ) {
      this.props.onScrollReachesBottom()
    }
  }

  onResize() {
    this.setScrollState()
  }

  onScroll() {
    this.setScrollState()
  }

  getHeaderStyle() {
    if (this.state.hasScroll) {
      return {
        overflowY: 'scroll',
      }
    }
  }

  getDisabledCells(rows, startIndex) {
    const disabledCells = []
    const disabledCellChecker = this.props.disabledCellChecker

    if (disabledCellChecker) {
      rows.forEach((row, x) => {
        this.props.columns.forEach((column, y) => {
          if (disabledCellChecker(row, column.id)) {
            disabledCells.push({ x: startIndex + x, y })
          }
        })
      })
    }

    return disabledCells
  }

  getScrollWrapperClassName() {
    return (
      'SpreadsheetGridScrollWrapper' +
      (this.props.isScrollable
        ? ' SpreadsheetGridScrollWrapper_scrollable'
        : '')
    )
  }

  renderResizer() {
    return (
      <div
        className='SpreadsheetGrid__resizer'
        onMouseDown={this.startColumnResize}
        style={{
          height: this.props.headerHeight + 'px',
        }}
      />
    )
  }

  renderHeader() {
    const columns = this.props.columns
    const { columnWidthValues } = this.state

    return (
      <div className='SpreadsheetGrid__header' style={this.getHeaderStyle()}>
        {columns.map((column, i) => {
          return (
            <div
              key={i}
              className='SpreadsheetGrid__headCell'
              data-index={i}
              style={{
                height: this.props.headerHeight + 'px',
                width: columnWidthValues
                  ? columnWidthValues[columns[i].id] + '%'
                  : 'auto',
              }}
            >
              {typeof column.title === 'string' ? column.title : column.title()}
              {this.props.isColumnsResizable &&
                i !== columns.length - 1 &&
                this.renderResizer()}
            </div>
          )
        })}
      </div>
    )
  }

  render() {
    const rows = this.props.isScrollable
      ? slice(this.props.rows, this.state.first, this.state.last)
      : this.props.rows

    return (
      <div className='SpreadsheetGridContainer' ref={this.tableEl}>
        {this.renderHeader()}
        <div
          className={this.getScrollWrapperClassName()}
          onScroll={this.onScroll}
          ref={this.scrollWrapperEl}
          style={{
            height: this.props.isScrollable
              ? `calc(100% - ${this.props.headerHeight}px)`
              : 'auto',
          }}
        >
          <ScrollDummy
            rows={this.props.rows}
            headerHeight={this.props.headerHeight}
            rowHeight={this.props.rowHeight}
            refEl={this.scrollDummyEl}
          />
          {
            <Grid
              {...this.props}
              ref={this.grid}
              rows={rows}
              allRows={this.props.rows}
              rowsCount={this.props.rows.length}
              startIndex={this.state.first}
              offset={this.state.offset}
              columnWidthValues={this.state.columnWidthValues}
              disabledCells={this.getDisabledCells(rows, this.state.first)}
            />
          }
        </div>
      </div>
    )
  }
}

SpreadsheetGridScrollWrapper.propTypes = Object.assign({}, tablePropTypes, {
  // scroll
  isScrollable: PropTypes.bool,
  onScroll: PropTypes.func,
  onScrollReachesBottom: PropTypes.func,
  // resize
  isColumnsResizable: PropTypes.bool,
  onColumnResize: PropTypes.func,
})

SpreadsheetGridScrollWrapper.defaultProps = {
  rows: [],
  isColumnsResizable: false,
  placeholder: 'There are no rows',
  headerHeight: 40,
  rowHeight: 48,
  isScrollable: true,
  focusOnSingleClick: false,
}

export default SpreadsheetGridScrollWrapper
