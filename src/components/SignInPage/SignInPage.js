import React from 'react'
import { default as SignIn } from 'decentraland-dapps/dist/containers/SignInPage'
import Footer from '../Footer'
import Header from '../Header'
import { Page } from 'decentraland-ui'

import './SignInPage.css'

const SignInPage = () => {
  return (
    <>
      <Header />
      <Page className="SignInPage">
        <SignIn />
      </Page>
      <Footer />
    </>
  )
}

export default React.memo(SignInPage)
