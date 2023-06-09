import { Logo } from 'decentraland-ui'
import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Container } from 'semantic-ui-react'

function ErrorPage(props) {
  const { connectionError } = props

  let errorText = t('helper.error_page', { error: connectionError || 'null' })
  if (connectionError && connectionError.indexOf('Failed to fetch') !== -1) {
    errorText = <p className="error">{t('helper.error_page.no_internet')}</p>
  }

  return (
    <Container className="Error">
      <Logo />
      <h3>{t('helper.error_page.message')}</h3>
      <p>{errorText}</p>
    </Container>
  )
}

export default React.memo(ErrorPage)
