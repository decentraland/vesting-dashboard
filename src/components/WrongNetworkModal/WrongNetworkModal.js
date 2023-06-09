import { getChainName } from '@dcl/schemas/dist/dapps/chain-id'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Modal } from 'decentraland-ui/dist/components/Modal/Modal'
import { ModalNavigation } from 'decentraland-ui/dist/components/ModalNavigation/ModalNavigation'
import { FormattedMessage } from 'react-intl'

const UNKNOWN_CHAIN_NAME = 'unknown chain'

function WrongNetworkModal(props) {
  const { currentNetwork, expectedNetwork, onSwitchNetwork } = props

  const expectedChainName = () => {
    return <b>{getChainName(expectedNetwork)}</b>
  }

  const currentChainName = () => {
    let chainName = currentNetwork ? getChainName(currentNetwork) : UNKNOWN_CHAIN_NAME
    return <b>{chainName || UNKNOWN_CHAIN_NAME}</b>
  }

  return (
    <Modal size="tiny" open={true} style={{ position: 'absolute' }}>
      <ModalNavigation title={<FormattedMessage id={'wrong_network_modal.title'} />} />
      <Modal.Content>
        <FormattedMessage
          id={'wrong_network_modal.content'}
          values={{
            expectedChainName: expectedChainName(),
            currentChainName: currentChainName(),
          }}
        />
      </Modal.Content>
      <Modal.Content>
        <Button fluid primary onClick={() => onSwitchNetwork && onSwitchNetwork(expectedNetwork)}>
          <FormattedMessage
            id="wrong_network_modal.button"
            values={{
              expectedChainName: expectedChainName(),
            }}
          />
        </Button>
      </Modal.Content>
    </Modal>
  )
}

export default WrongNetworkModal
