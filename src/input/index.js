import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';

class SpreadsheetTableInput extends React.PureComponent {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onBlur = this.onBlur.bind(this);

        this.state = {
            value: this.props.value,
        };
    }

    componentDidMount() {
        this.prepareFocus(this.props.focus);
    }

    componentWillReceiveProps({ value, focus }) {
        this.setState({
            value
        }, () => {
            this.prepareFocus(focus);
        });
    }

    onChange(e) {
        const value = e.target.value;

        this.setState({
            value
        });
    }

    onBlur(e) {
        const value = e.target.value;

        this.setState({
            value
        }, () => {
            if (this.props.onBlur) {
                this.props.onBlur(value);
            }
        });
    }

    prepareFocus(focus) {
        if (focus) {
            this.input.focus();
            this.input.selectionStart = this.input.value.length;
        } else if (this.input === document.activeElement) {
            this.input.blur();
        }
    }

    render() {
        return (
            <input
                className="SpreadsheetTable__Input"
                onChange={this.onChange}
                onBlur={this.onBlur}
                value={this.state.value}
                placeholder={this.props.placeholder}
                ref={input => this.input = input}
            />
        );
    }
}

SpreadsheetTableInput.propTypes = {
    value: PropTypes.string,
    onBlur: PropTypes.func,
    placeholder: PropTypes.string
};

SpreadsheetTableInput.defaultProps = {
    value: ''
};

export default SpreadsheetTableInput;