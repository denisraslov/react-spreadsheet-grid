import React from 'react';
import PropTypes from 'prop-types';
import keys from './../kit/keymap';

import styles from './styles.css';

class SpreadsheetGridInput extends React.PureComponent {

    constructor(props) {
        super(props);

        this.onKeyDown = this.onKeyDown.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            value: this.props.value
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

    onKeyDown(e) {
        if (e.keyCode === keys.ENTER || e.keyCode === keys.TAB) {
            if (this.props.onChange) {
                this.props.onChange(this.input.value);
            }

            e.preventDefault();
        }
    }

    onChange(e) {
        const value = e.target.value;

        this.setState({
            value
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
                className="SpreadsheetGridInput"
                value={this.state.value}
                placeholder={this.props.placeholder}
                ref={input => this.input = input}
                onKeyDown={this.onKeyDown}
                onChange={this.onChange}
            />
        );
    }
}

SpreadsheetGridInput.propTypes = {
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
    ]),
    onChange: PropTypes.func,
    placeholder: PropTypes.string
};

SpreadsheetGridInput.defaultProps = {
    value: ''
};

export default SpreadsheetGridInput;