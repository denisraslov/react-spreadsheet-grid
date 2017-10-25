import React from 'react';
import Table, { propTypes as tablePropTypes } from './../table';
import ScrollDummy from './../scrollDummy';
import styles from './styles.css';

class SpreadsheetTableScrollWrapper extends React.PureComponent {
    constructor(props) {
        super(props);

        this.onScroll = this.onScroll.bind(this);
        this.onResize = this.onResize.bind(this);
        this.scrollCalculations = this.scrollCalculations.bind(this);

        this.state = {
            first: 0,
            last: this.props.rows.length,
            position: 0
        };
    }

    componentDidMount() {
        window.addEventListener('resize', this.onResize, false);

        const visibleHeight = this.scrollWrapperElement.parentNode.offsetHeight;
        const last = Math.floor(visibleHeight / this.props.cellHeight);

        this.setState({
            first: this.state.first,
            last,
            position: 0
        });
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onResize, false);
    }

    scrollCalculations() {
        const scrollTop = this.scrollWrapperElement.scrollTop;
        const first = Math.max(0, Math.floor(scrollTop / this.props.cellHeight) - 1);
        const visibleHeight = this.scrollWrapperElement.parentNode.offsetHeight;

        const last = Math.ceil((scrollTop + visibleHeight) / this.props.cellHeight);

        this.setState({
            first,
            last
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