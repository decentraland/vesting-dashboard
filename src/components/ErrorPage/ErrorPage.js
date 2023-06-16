import { Logo } from 'decentraland-ui'
import React from 'react'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { Container } from 'semantic-ui-react'

function ErrorPage(props) {
  const { connectionError } = props

  const isFailedToFetchError = connectionError && connectionError.indexOf('Failed to fetch') !== -1
  const errorText = isFailedToFetchError ? (
    t('helper.error_page', { error: connectionError || 'null' })
  ) : (
    <p className="error">{t('helper.error_page.no_internet')}</p>
  )

  return (
    <Container className="Error">
      <Logo />
      <h3>{t('helper.error_page.message')}</h3>
      <p>{errorText}</p>
    </Container>
  )
}

export default React.memo(ErrorPage)
