import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.css'

class SpreadsheetGridScrollDummy extends React.Component {
  shouldComponentUpdate(nextProps) {
    return nextProps.rows !== this.props.rows
  }

  getHeight() {
    const { rows, rowHeight } = this.props
    return rows.length * rowHeight + 'px'
  }

  render() {
    return (
      <div
        className='SpreadsheetGridScrollDummy'
        style={{ height: this.getHeight() }}
        ref={this.props.refEl}
      ></div>
    )
  }
}

SpreadsheetGridScrollDummy.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.any),
  headerHeight: PropTypes.number.isRequired,
  rowHeight: PropTypes.number.isRequired,
  refEl: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }).isRequired,
}

export default SpreadsheetGridScrollDummy
