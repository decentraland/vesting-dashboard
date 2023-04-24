import React from 'react'

import { getChainName } from '@dcl/schemas/dist/dapps/chain-id'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Modal } from 'decentraland-ui/dist/components/Modal/Modal'
import { ModalNavigation } from 'decentraland-ui/dist/components/ModalNavigation/ModalNavigation'
import './WrongNetworkModal.css'

const UNKNOWN_CHAIN_NAME = 'unknown chain'

function WrongNetworkModal(props){
  const { isOpen,
    currentNetwork,
    expectedNetwork,
    onSwitchNetwork } = props

  const expectedChainName = () => {
    return <b>{getChainName(expectedNetwork)}</b>
  }

  const currentChainName = () => {
    let chainName = currentNetwork
      ? getChainName(currentNetwork)
      : UNKNOWN_CHAIN_NAME
    return <b>{chainName || UNKNOWN_CHAIN_NAME}</b>
  }

  return (
    <Modal
      size="tiny"
      open={isOpen}
      style={{ position: 'absolute' }}
    >
    <ModalNavigation title={"Wrong Network"} />
    <Modal.Content>
      {"You need to be connected to "}{expectedChainName()}
      {" to use this app, but you are currently connected to "}{currentChainName()}.
    </Modal.Content>
     <Modal.Content>
       <Button
         fluid
         primary
         onClick={() => onSwitchNetwork && onSwitchNetwork(expectedNetwork)}
       >
         {`Switch to `}{expectedChainName()}
       </Button>
     </Modal.Content>
    </Modal>)
}

export default WrongNetworkModal;
