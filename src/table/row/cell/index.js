import React from 'react';
import PropTypes from 'prop-types';

class SpreadsheetCell extends React.PureComponent {

    shouldComponentUpdate(nextProps) {
        return this.props.isActive !== nextProps.isActive
            || this.props.isFocused !== nextProps.isFocused
            || this.props.x !== nextProps.x
            || this.props.disabledCells !== nextProps.disabledCells;
    }

    render() {
        const {
            y,
            className,
            onClick,
            onDoubleClick,
            children
        } = this.props;

        return (
            <td
                key={y}
                className={className}
                onClick={onClick}
                onDoubleClick={onDoubleClick}
            >
                {children}
            </td>
        );
    }
}

ExcelWrapperCell.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
    ]).isRequired,
    isActive: PropTypes.bool,
    isFocused: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func,
    disabledCells: PropTypes.bool
};

export default ExcelWrapperCell;
