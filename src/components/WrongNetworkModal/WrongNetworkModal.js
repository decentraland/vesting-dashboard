import React from 'react'

import { ChainId, getChainName } from '@dcl/schemas/dist/dapps/chain-id' //TODO: solve dependency problems
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { Modal } from 'decentraland-ui/dist/components/Modal/Modal'
import { ModalNavigation } from 'decentraland-ui/dist/components/ModalNavigation/ModalNavigation'
import './WrongNetworkModal.css'

function WrongNetworkModal(props){
  const { isOpen,
    currentNetwork,
    onSwitchNetwork } = props

  const expectedNetwork = ChainId.ETHEREUM_MAINNET
  const expectedChainName = () => {
    return <b>{getChainName(expectedNetwork)}</b>
  }

  const currentChainName = () => {
   return <b>{currentNetwork
        ? getChainName(currentNetwork.chainId)
        : 'unknown chain'}</b>
  }


  console.log('expectedChainName', expectedChainName())

  function getContent() {
    return <>
      {"You need to be connected to "}{expectedChainName()}
      {" to use this app, but you are currently connected to "}{currentChainName()}.
    </>
  }

  return (
       <Modal
         size="tiny"
         open={isOpen}
         style={{ position: 'absolute' }}
       >
         <ModalNavigation title={"Wrong Network"} />
         <Modal.Content>
           {getContent()}
         </Modal.Content>
         {/*{providerType === ProviderType.INJECTED && (*/}
           <Modal.Content>
             <Button
               fluid
               primary
               onClick={() => onSwitchNetwork && onSwitchNetwork(expectedNetwork)}
             >
               {`Switch to `}{expectedChainName()}
             </Button>
           </Modal.Content>
         {/*)}*/}
       </Modal>)

}

export default WrongNetworkModal;
