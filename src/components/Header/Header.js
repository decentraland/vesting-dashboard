// import { Logo, UserMenu } from 'decentraland-ui'
import React, { useEffect, useState } from 'react'
// import { Container, Grid } from 'semantic-ui-react'

// import { DaoInitiativeContext } from '../../context/DaoInitiativeContext'
// import useResponsive, { onlyMobileMaxWidth } from '../../hooks/useResponsive'
// import { openInNewTab } from '../../utils'
// import DaoInitiativeButton from '../DaoInitiativeButton/DaoInitiativeButton'
import WalletSelector from '../WalletSelector'
import { getDclProfile } from './utils'

import { Navbar as BaseNavbar } from 'decentraland-dapps/dist/containers'

import './Header.css'

function Header(props) {
  // const { location, onNavigate, isConnected } = props
  // const { pathname, search } = location
  console.log(props)
  const { address } = props

  const [isSignedIn, setIsSignedIn] = useState(false)
  const [isSignInModalOpen, setIsSignInModalOpen] = useState(false)
  const [profile, setProfile] = useState(undefined)
  useEffect(() => {
    if (address) {
      setIsSignedIn(true)
      getDclProfile(address).then((profile) => {
        setProfile(profile)
      })
    } else {
      setIsSignedIn(false)
    }
  }, [address])

  return (
    <>
      <BaseNavbar
        // {...props}
        // activePage="marketplace"
        // isFullscreen={props.isFullscreen}
        isSignIn={true}
        onSignIn={() => setIsSignInModalOpen(true)}
        // onClickAccount={handleOnClickAccount}
      />
      <WalletSelector open={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />
    </>
  )
  // const { proposalUrl } = useContext(DaoInitiativeContext)
  // const responsive = useResponsive()
  // const isMobile = responsive({ maxWidth: onlyMobileMaxWidth })
  // return (
  //   <div className="header">
  //     <Container style={{ height: 'auto' }}>
  //       <Grid verticalAlign="middle" style={{ marginLeft: 0, marginRight: 0 }}>
  //         <Grid.Row>
  //           <Grid.Column style={{ width: 'fit-content', paddingLeft: 0 }}>
  //             <Logo />
  //           </Grid.Column>
  //           <Grid.Column style={{ padding: 0 }}>
  //             <h1 className="header-title">Decentraland</h1>
  //           </Grid.Column>
  //           <Grid.Column floated="right" style={{ width: 'fit-content', paddingRight: 0 }}>
  //             {isMobile ? (
  //               proposalUrl && <DaoInitiativeButton />
  //             ) : (
  //               <UserMenu
  //                 onSignIn={() => setIsSignInModalOpen(true)}
  //                 isSignedIn={isSignedIn}
  //                 avatar={profile}
  //                 onClickProfile={() => openInNewTab(`https://governance.decentraland.org/profile/?address=${address}`)}
  //               />
  //             )}
  //           </Grid.Column>
  //         </Grid.Row>
  //       </Grid>
  //     </Container>
  //     <WalletSelector open={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />
  //   </div>
  // )
}

export default React.memo(Header)
