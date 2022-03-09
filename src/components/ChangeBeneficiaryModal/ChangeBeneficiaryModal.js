import React from 'react'
import Modal from "../Modal";
import Button from "../Button";
import Input from "../Input";
import { isValidAddress } from "../../utils";
import './ChangeBeneficiaryModal.css'

export default class ChangeBeneficiaryModal extends React.PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      address: ''
    }
  }

  handleSubmit = () => {
    if (isValidAddress(this.state.address)) {
      this.props.onSubmit(this.state.address)
    }
  }

  handleChange = e => {
    this.setState({ address: e.target.value.trim() })
  }

  render() {
    const { isOpen, onClose } = this.props
    return (
      <Modal isOpen={isOpen} onOverlayClick={onClose} onEsc={onClose} onEnter={this.handleSubmit}>
        <Modal.Header onClose={onClose}>Change Beneficiary</Modal.Header>
        <Modal.Body>
          <label>Beneficiary address</label>
          <Input
            value={this.state.address}
            placeholder="0x..."
            onChange={this.handleChange}
            className="beneficiary-address-input"
          />
          <p>This is an irreversible operation. Please check the address carefully.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button disabled={!isValidAddress(this.state.address)} onClick={this.handleSubmit}>
            TRANSFER
          </Button>
        </Modal.Footer>
      </Modal>
    )
  }
}
