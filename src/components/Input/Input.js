import React from 'react'
import PropTypes from 'prop-types'

import './Input.css'

export default class Button extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
  }

  static defaultProps = {
    className: '',
  }

  render() {
    const { className, ...rest } = this.props
    const classes = `Input ${className}`
    return <input className={classes} {...rest} />
  }
}
