import React from 'react';
import Table, { propTypes as tablePropTypes } from './../table';
import ScrollDummy from './../scrollDummy';
import styles from './styles.css';

const RESERVE_ROWS_COUNT = 10;

class SpreadsheetTableScrollWrapper extends React.PureComponent {
    constructor(props) {
        super(props);

        this.onScroll = this.onScroll.bind(this);
        this.onResize = this.onResize.bind(this);
        this.scrollCalculations = this.scrollCalculations.bind(this);

        this.state = {
            first: 0,
            last: this.props.rows.length,
            offset: 0
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize, false);

        this.setState({
            last: this.calculateLast(this.state.first)
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize, false);
    }

    calculateLast(first) {
        const wrapper = this.scrollWrapperElement;
        const visibleHeight = wrapper ? wrapper.parentNode.offsetHeight + 200 : 0;

        return first + Math.ceil(visibleHeight / this.props.cellHeight);
    }

    scrollCalculations() {
        const scrollTop = Math.max(
            this.scrollWrapperElement.scrollTop - this.props.headerHeight,
            0);
        const first = Math.max(0, Math.floor(scrollTop / this.props.cellHeight) - RESERVE_ROWS_COUNT);
        const last = Math.min(this.props.rows.length, this.calculateLast(first) + RESERVE_ROWS_COUNT);

        this.setState({
            first,
            last,
            offset: first * this.props.cellHeight
        });
    }

    onResize() {
        this.scrollCalculations();
    }

    onScroll(e) {
        if (e.target === this.scrollWrapperElement) {
            this.scrollCalculations();
        }
    }

    render() {
        return (
            <div
                className="SpreadsheetTableScrollWrapper"
                onScroll={this.onScroll}
                ref={node => this.scrollWrapperElement = node}
            >
                <ScrollDummy
                    rows={this.props.rows}
                    headerHeight={this.props.headerHeight}
                    cellHeight={this.props.cellHeight}
                />
                {
                    <Table
                        {...this.props}
                        first={this.state.first}
                        last={this.state.last}
                        offset={this.state.offset}
                    />
                }
            </div>
        );
    }
}

SpreadsheetTableScrollWrapper.propTypes = tablePropTypes;

SpreadsheetTableScrollWrapper.defaultProps = {
    rows: [],
    columnsResize: false,
    placeholder: 'There are no rows',
    headerHeight: 40,
    cellHeight: 48
};

export default SpreadsheetTableScrollWrapper;