import React from 'react'
import PropTypes from 'prop-types'
import keys from './../kit/keymap'

import styles from './styles.css'

class SpreadsheetGridInput extends React.PureComponent {
  constructor(props) {
    super(props)

    this.onKeyDown = this.onKeyDown.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onBlur = this.onBlur.bind(this)

    this.state = {
      props,
      value: this.props.value,
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps !== prevState.props) {
      return {
        ...prevState,
        props: nextProps,
        value: nextProps.value,
      }
    }
    return prevState
  }

  componentDidMount() {
    this.prepareFocus(this.props.focus)
  }

  componentDidUpdate(prevProps) {
    // Don't touch focus if the state is updating
    if (this.props !== prevProps) {
      this.prepareFocus(this.props.focus)
    }
  }

  onKeyDown(e) {
    if (e.keyCode === keys.ENTER || e.keyCode === keys.TAB) {
      e.preventDefault()
      this.input.blur()
    }
  }

  onChange(e) {
    const value = e.target.value

    this.setState({
      value,
    })
  }

  onBlur() {
    if (this.props.onChange) {
      this.props.onChange(this.input.value)
    }
  }

  prepareFocus(focus) {
    if (focus) {
      this.input.focus()
      if (this.props.selectTextOnFocus) {
        this.input.select()
      } else {
        this.input.selectionStart = this.input.value.length
      }
    } else if (this.input === document.activeElement) {
      this.input.blur()
    }
  }

  render() {
    return (
      <input
        className='SpreadsheetGridInput'
        value={this.state.value}
        placeholder={this.props.placeholder}
        ref={(input) => (this.input = input)}
        onKeyDown={this.onKeyDown}
        onChange={this.onChange}
        onBlur={this.onBlur}
      />
    )
  }
}

SpreadsheetGridInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  selectTextOnFocus: PropTypes.bool,
}

SpreadsheetGridInput.defaultProps = {
  value: '',
  selectTextOnFocus: false,
}

export default SpreadsheetGridInput
