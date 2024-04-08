import React from 'react'
import PropTypes from 'prop-types'

import './Modal.css'

export default class Modal extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    isOpen: PropTypes.bool.isRequired,
    children: PropTypes.node,
  }
  static defaultProps = {
    className: '',
    isOpen: false,
  }
  handleKeyDown = (e) => {
    const { onEnter, onEsc } = this.props
    if (e.which === 13 && onEnter) {
      onEnter()
    }
    if (e.which === 27 && onEsc) {
      onEsc()
    }
  }

  handleClick = (e) => {
    e.stopPropagation()
  }

  render() {
    const { className, isOpen, children, onOverlayClick } = this.props

    const containerClassName = `${className} ${isOpen ? 'modal-open' : ''}`
    const modalClassName = `Modal fade ${isOpen ? 'in' : ''}`

    return (
      <div className={containerClassName} onKeyDown={this.handleKeyDown}>
        <div className={modalClassName} tabIndex="-1" role="dialog" onClick={onOverlayClick}>
          <div className="modal-dialog" role="document" onClick={this.handleClick}>
            <div className="modal-content">{children}</div>
          </div>
        </div>
        {isOpen && <div className="modal-backdrop fade in" />}
      </div>
    )
  }
}

export class ModalCloseButton extends React.PureComponent {
  render() {
    const { onClose, children } = this.props
    return (
      <button type="button" className="close btn btn-secondary" data-dismiss="modal" onClick={onClose}>
        {children}
      </button>
    )
  }
}

export class ModalBody extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
  }
  static defaultProps = {
    className: '',
  }
  render() {
    const { children, className } = this.props
    const classes = `modal-body ${className}`
    return <div className={classes}>{children}</div>
  }
}

export class ModalFooter extends React.PureComponent {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node,
  }
  static defaultProps = {
    className: '',
  }
  render() {
    const { children, className } = this.props
    const classes = `modal-footer ${className}`
    return <div className={classes}>{children}</div>
  }
}

export class ModalHeader extends React.PureComponent {
  render() {
    const { children, onClose, className } = this.props
    const classes = `modal-header ${className}`
    return (
      <div className={classes}>
        {onClose && (
          <ModalCloseButton onClose={onClose}>
            <span aria-hidden="true">&times</span>
          </ModalCloseButton>
        )}
        <div className="banner">
          <h2>{children}</h2>
        </div>
      </div>
    )
  }
}

Modal.Body = ModalBody
Modal.Footer = ModalFooter
Modal.Header = ModalHeader
