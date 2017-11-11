import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';

class SpreadsheetTableScrollDummy extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rows: this.props.rows
        };

        this.calculateHeight();
    }

    componentWillReceiveProps(newProps) {
        this.calculateHeight(newProps.rows);
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.rows !== this.state.rows;
    }

    calculateHeight(rows = this.state.rows) {
        this.height = rows.length * this.props.cellHeight + this.props.headerHeight + 'px';
    }

    render() {
        return (
            <div
                className="SpreadsheetTableScrollDummy"
                style={{ height: this.height }}
            >
            </div>
        );
    }
}

SpreadsheetTableScrollDummy.propTypes = {
    rows: PropTypes.arrayOf(PropTypes.any),
    headerHeight: PropTypes.number.isRequired,
    cellHeight: PropTypes.number.isRequired
};

export default SpreadsheetTableScrollDummy;