import PropTypes from 'prop-types';

export const propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string,
            title: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.func
            ]),
            value: PropTypes.func.isRequired
        })
    ).isRequired,
    rows: PropTypes.arrayOf(PropTypes.any),
    getRowKey: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    disabledCellChecker: PropTypes.func,
    focusedCell: PropTypes.shape({
        x: PropTypes.number.isRequired,
        y: PropTypes.number.isRequired
    }),
    onCellClick: PropTypes.func,
    blurCurrentFocus: PropTypes.bool,
    focusOnSingleClick: PropTypes.bool,

    // scroll
    headerHeight: PropTypes.number,
    rowHeight: PropTypes.number,

    // resize
    columnWidthValues: PropTypes.object
};