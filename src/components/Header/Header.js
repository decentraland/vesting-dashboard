import UserMenu from 'decentraland-dapps/dist/containers/UserMenu'
import React, { useEffect, useState } from 'react'
import { openInNewTab } from '../../utils'
import WalletSelector from '../WalletSelector'
import { getDclProfile } from './utils'

import { Navbar as BaseNavbar } from 'decentraland-dapps/dist/containers'

import './Header.css'

function Header(props) {
  const { address, fetchProfile } = props

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
  }, [address, fetchProfile])

  return (
    <>
      <BaseNavbar
        isSignIn={!isSignedIn}
        rightMenu={
          <UserMenu
            onSignIn={() => setIsSignInModalOpen(true)}
            isSignedIn={isSignedIn}
            avatar={profile}
            onClickProfile={() => openInNewTab(`https://governance.decentraland.org/profile/?address=${address}`)}
          />
        }
      />
      <WalletSelector open={isSignInModalOpen} onClose={() => setIsSignInModalOpen(false)} />
    </>
  )
}

export default React.memo(Header)
