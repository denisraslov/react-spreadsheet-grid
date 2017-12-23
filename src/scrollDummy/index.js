import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';

class SpreadsheetGridScrollDummy extends React.Component {
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
        this.height = rows.length * this.props.rowHeight + 'px';
    }

    render() {
        return (
            <div
                className="SpreadsheetGridScrollDummy"
                style={{ height: this.height }}
                ref={this.props.refEl}
            >
            </div>
        );
    }
}

SpreadsheetGridScrollDummy.propTypes = {
    rows: PropTypes.arrayOf(PropTypes.any),
    headerHeight: PropTypes.number.isRequired,
    rowHeight: PropTypes.number.isRequired,
    refEl: PropTypes.func.isRequired
};

export default SpreadsheetGridScrollDummy;