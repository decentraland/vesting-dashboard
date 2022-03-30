import { Close, Field, Modal, Button } from 'decentraland-ui'
import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { isValidAddress } from '../../utils'
import './ChangeBeneficiaryModal.css'

function ChangeBeneficiaryModal(props) {
  const { open, onClose, onSubmit } = props

  const [state, setState] = useState({
    address: '',
    error: false,
    errorMessage: '',
    loading: false,
    successMessage: '',
  })

  const setAddress = (addr) => setState((prev) => ({ ...prev, address: addr }))
  const setError = (isError, msg = '') =>
    setState((prev) => ({ ...prev, error: isError, errorMessage: msg }))
  const setLoading = (isLoading) =>
    setState((prev) => ({ ...prev, loading: isLoading }))
  const setSuccess = (msg = '') =>
    setState((prev) => ({ ...prev, successMessage: msg }))

  const transfer = () => {
    if (isValidAddress(state.address)) {
      setLoading(true)
      setError(false)
      onSubmit(state.address)
        .then((addr) => {
          setLoading(false)
          setSuccess(
            <FormattedMessage
              id="modal.success"
              values={{
                address: addr,
                br: <br />,
              }}
            />
          )
        })
        .catch((e) => {
          setLoading(false)
          setError(true, e.message)
        })
    } else {
      setError(true, <FormattedMessage id="modal.error" />)
    }
  }

  return (
    <Modal
      className="changeBeneficiaryModal"
      size="small"
      open={open}
      onClose={onClose}
      closeIcon={<Close />}
    >
      <Modal.Header>
        <FormattedMessage id="modal.title" />
      </Modal.Header>
      <Modal.Content>
        <p>
          <FormattedMessage id="modal.warning" />
        </p>
        <Field
          onChange={(_, data) => {
            setAddress(data.value)
            setError(false)
          }}
          label={<FormattedMessage id="modal.label" />}
          placeholder="0x..."
          error={state.error}
          message={state.errorMessage}
          loading={state.loading}
          disabled={state.loading}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={transfer} disabled={state.loading}>
          <FormattedMessage id="modal.button" />
        </Button>
      </Modal.Actions>
      <Modal.Content>
        <p className="success">{state.successMessage}</p>
      </Modal.Content>
    </Modal>
  )
}

export default ChangeBeneficiaryModal
