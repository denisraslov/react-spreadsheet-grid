import PropTypes from 'prop-types'

export const propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      value: PropTypes.func.isRequired,
      width: PropTypes.number,
    })
  ).isRequired,
  rows: PropTypes.arrayOf(PropTypes.any),
  getRowKey: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  disabledCellChecker: PropTypes.func,
  onCellClick: PropTypes.func,
  onActiveCellChanged: PropTypes.func,
  focusOnSingleClick: PropTypes.bool,

  // scroll
  headerHeight: PropTypes.number,
  rowHeight: PropTypes.number,
}
