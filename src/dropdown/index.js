import React from 'react'
import { findDOMNode } from 'react-dom'
import PropTypes from 'prop-types'

import styles from './styles.css'

class SpreadsheetGridDropdown extends React.PureComponent {
  constructor(props) {
    super(props)

    this.onHeaderClick = this.onHeaderClick.bind(this)
    this.onGlobalClick = this.onGlobalClick.bind(this)

    this.state = {
      isOpen: this.props.isOpen,
    }
  }

  static getDerivedStateFromProps({ isOpen }, prevState) {
    if (isOpen !== undefined) {
      return {
        ...prevState,
        isOpen,
      }
    }
    return prevState
  }

  componentWillUnmount() {
    document.removeEventListener('click', this.onGlobalClick, false)
  }

  onGlobalClick(event) {
    const dropdownElement = findDOMNode(this)

    if (!event.skipDropdownGlobalClick) {
      if (
        event.target !== dropdownElement &&
        !dropdownElement.contains(event.target)
      ) {
        this.close()
      }
    }
  }

  onHeaderClick() {
    if (this.state.isOpen) {
      this.close()
    } else {
      this.open()
    }
  }

  open() {
    this.setState({
      isOpen: true,
    })
  }

  close() {
    this.setState({
      isOpen: false,
    })
  }

  render() {
    return (
      <div className='SpreadsheetGridDropdown'>
        {React.cloneElement(this.props.header, {
          onClick: this.onHeaderClick,
        })}
        <div
          ref={(node) => (this.body = node)}
          className='SpreadsheetGridDropdown__body'
          style={{
            display: this.state.isOpen ? 'block' : 'none',
          }}
        >
          {this.props.body}
        </div>
      </div>
    )
  }
}

SpreadsheetGridDropdown.propTypes = {
  header: PropTypes.element.isRequired,
  body: PropTypes.oneOfType([
    PropTypes.element.isRequired,
    PropTypes.arrayOf(PropTypes.element).isRequired,
  ]),
  isOpen: PropTypes.bool,
}

SpreadsheetGridDropdown.defaultProps = {
  isOpen: false,
}

export default SpreadsheetGridDropdown
