import React from 'react'
import PropTypes from 'prop-types'
import './Card.css'

export default class Card extends React.PureComponent {
  static propTypes = {
    title: PropTypes.string,
    children: PropTypes.node
  }
  render() {
    const { children, title } = this.props
    return (
      <div className="Card">
        {title && <h3>{title}</h3>}
        {children}
      </div>
    )
  }
}
