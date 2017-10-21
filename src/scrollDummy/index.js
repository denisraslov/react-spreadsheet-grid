import React from 'react';
import PropTypes from 'prop-types';
import styles from './styles.css';

class SpreadsheetTableScrollDummy extends React.PureComponent {
    constructor(props) {
        super(props);

        this.calculateContainerHeight = this.calculateContainerHeight.bind(this);

        this.state = {
            rows: this.props.rows
        };
    }

    calculateContainerHeight(rows = this.state.rows) {
        this.containerHeight = rows.length * this.props.cellHeight + this.props.headerHeight + 'px';
    }

    componentWillMount() {
        this.calculateContainerHeight();
    }

    componentWillReceiveProps(newProps) {
        this.calculateContainerHeight(newProps.rows);
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.rows !== this.state.rows;
    }

    render() {
        return (
            <div
                className="SpreadsheetTableScrollDummy"
                style={{ height: this.containerHeight }}
            >
            </div>
        );
    }
}

SpreadsheetTableScrollDummy.propTypes = {
    rows: PropTypes.arrayOf(PropTypes.object),
    headerHeight: PropTypes.number.isRequired,
    cellHeight: PropTypes.number.isRequired
};

export default SpreadsheetTableScrollDummy;