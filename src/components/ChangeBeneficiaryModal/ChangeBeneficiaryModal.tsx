import { Close, Field, Modal, Button } from 'decentraland-ui'
import { useState } from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { isValidAddress } from '../../utils'
import './ChangeBeneficiaryModal.css'
import { changeBeneficiary } from '../../modules/api'
import { getEthProvider } from '../../modules/ethereum/utils'

function ChangeBeneficiaryModal({ open, onClose, contract }) {
  const [state, setState] = useState({
    address: '',
    error: false,
    errorMessage: '',
    loading: false,
    successMessage: '',
  })

  const setAddress = (addr) => setState((prev) => ({ ...prev, address: addr }))
  const setError = (isError, msg = '') => setState((prev) => ({ ...prev, error: isError, errorMessage: msg }))
  const setLoading = (isLoading) => setState((prev) => ({ ...prev, loading: isLoading }))
  const setSuccess = (msg = '') => setState((prev) => ({ ...prev, successMessage: msg }))

  const transfer = async () => {
    if (isValidAddress(state.address)) {
      setLoading(true)
      setError(false)
      try {
        const provider = await getEthProvider()
        await changeBeneficiary(state.address, contract, provider)
        setLoading(false)
        setSuccess(
          t('modal.success', {
            address: state.address,
            br: <br />,
          })
        )
      } catch (e) {
        setLoading(false)
        setError(true, e.message)
      }
    } else {
      setError(true, t('modal.error'))
    }
  }

  return (
    <Modal className="changeBeneficiaryModal" size="small" open={open} onClose={onClose} closeIcon={<Close />}>
      <Modal.Header>{t('modal.title')}</Modal.Header>
      <Modal.Content>
        <p>{t('modal.warning')}</p>
        <Field
          onChange={(_, data) => {
            setAddress(data.value)
            setError(false)
          }}
          label={t('modal.label')}
          placeholder="0x..."
          error={state.error}
          message={state.errorMessage}
          loading={state.loading}
          disabled={state.loading}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button primary onClick={transfer} disabled={state.loading}>
          {t('modal.button')}
        </Button>
      </Modal.Actions>
      <Modal.Content>
        <p className="success">{state.successMessage}</p>
      </Modal.Content>
    </Modal>
  )
}

export default ChangeBeneficiaryModal
