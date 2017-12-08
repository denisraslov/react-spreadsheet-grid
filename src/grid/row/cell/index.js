import React from 'react';
import PropTypes from 'prop-types';

class SpreadsheetCell extends React.Component {

    shouldComponentUpdate(nextProps) {
        return this.props.row !== nextProps.row
            || this.props.isActive !== nextProps.isActive
            || this.props.isFocused !== nextProps.isFocused
            || this.props.x !== nextProps.x
            || this.props.disabledCells !== nextProps.disabledCells
            || this.props.width !== nextProps.width;
    }

    render() {
        const {
            y,
            className,
            onClick,
            onDoubleClick,
            children,
            width,
            height
        } = this.props;

        return (
            <div
                key={y}
                className={className}
                onClick={onClick}
                onDoubleClick={onDoubleClick}
                style={{
                    width: width + '%',
                    height: height + 'px'
                }}
            >
                {children}
            </div>
        );
    }
}

SpreadsheetCell.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    row: PropTypes.any.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.string,
        PropTypes.element,
        PropTypes.arrayOf(PropTypes.element)
    ]).isRequired,
    isActive: PropTypes.bool,
    isFocused: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func,
    onDoubleClick: PropTypes.func,
    disabledCells: PropTypes.arrayOf(PropTypes.object),
    width: PropTypes.number,
    height: PropTypes.number
};

export default SpreadsheetCell;
