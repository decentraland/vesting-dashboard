import './Modal.css'

const ModalCloseButton = ({ onClose, children }) => {
  return (
    <button type="button" className="close btn btn-secondary" data-dismiss="modal" onClick={onClose}>
      {children}
    </button>
  )
}

const ModalBody = ({ children, className = '' }) => {
  const classes = `modal-body ${className}`
  return <div className={classes}>{children}</div>
}

const ModalFooter = ({ children, className = '' }) => {
  const classes = `modal-footer ${className}`
  return <div className={classes}>{children}</div>
}

const ModalHeader = ({ children, className = '', onClose }) => {
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

const Modal = ({ className = '', isOpen = false, children, onOverlayClick, onEnter, onEsc }) => {
  const handleKeyDown = (e) => {
    if (e.which === 13 && onEnter) {
      onEnter()
    }
    if (e.which === 27 && onEsc) {
      onEsc()
    }
  }

  const handleClick = (e) => {
    e.stopPropagation()
  }

  const containerClassName = `${className} ${isOpen ? 'modal-open' : ''}`
  const modalClassName = `Modal fade ${isOpen ? 'in' : ''}`

  return (
    <div className={containerClassName} onKeyDown={handleKeyDown}>
      <div className={modalClassName} tabIndex={-1} role="dialog" onClick={onOverlayClick}>
        <div className="modal-dialog" role="document" onClick={handleClick}>
          <div className="modal-content">{children}</div>
        </div>
      </div>
      {isOpen && <div className="modal-backdrop fade in" />}
    </div>
  )
}

export default Modal

Modal.Body = ModalBody
Modal.Footer = ModalFooter
Modal.Header = ModalHeader
