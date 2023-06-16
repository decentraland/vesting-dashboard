import { Helmet } from 'react-helmet'
import { Grid } from 'semantic-ui-react'
import { Logo, Header, Popup } from 'decentraland-ui'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import { formatNumber } from 'decentraland-dapps/dist/lib/utils'
import { copyToClipboard, getMonthDiff } from '../../../utils'
import ManaWidget from '../../ManaWidget'
import useResponsive, { onlyMobileMaxWidth } from '../../../hooks/useResponsive'
import Copy from '../../../images/copy.svg'
import Link from '../../../images/link.svg'
import DaiLogo from '../../../images/dai_logo.svg'
import UsdtLogo from '../../../images/usdt_logo.svg'
import UsdcLogo from '../../../images/usdc_logo.svg'

import './Overview.css'
import useReviewUrl from '../../../hooks/useReviewUrl'

const logo = {
  DAI: DaiLogo,
  USDT: UsdtLogo,
  USDC: UsdcLogo,
}

export default function Overview(props) {
  const { address, contract } = props

  const { symbol, start, cliff, duration, total } = contract
  const vestingMonths = getMonthDiff(start, start + duration)
  const vestingCliff = getMonthDiff(start, cliff)

  const [reviewUrl, handleClick] = useReviewUrl(address)

  const responsive = useResponsive()
  const isMobile = responsive({ maxWidth: onlyMobileMaxWidth })

  return (
    <>
      <Helmet>
        <title>{t('global.title', { token: symbol })}</title>
      </Helmet>
      <Grid columns={symbol === 'MANA' && !isMobile ? 2 : 1} className="overview">
        <Grid.Row>
          <Grid.Column floated="left" style={{ padding: 0 }}>
            <Grid className="contract" style={{ width: '100%' }}>
              {symbol !== 'MANA' ? (
                <Grid.Column className="TokenLogo">
                  <img src={logo[symbol]} style={{ width: isMobile ? '48px' : '72px' }} alt="" />
                </Grid.Column>
              ) : (
                isMobile && (
                  <Grid.Column className="TokenLogo">
                    <Logo />
                  </Grid.Column>
                )
              )}
              <Grid.Column className="Info">
                <Header size="large" className={`TokenContract ${symbol}`}>
                  {t('overview.title', { token: symbol })}
                </Header>
                <Header sub>
                  {address}{' '}
                  <a href={reviewUrl} onClick={handleClick}>
                    <img src={Link} alt="" />
                  </a>
                  <Popup
                    content={t('global.copied')}
                    position="bottom center"
                    trigger={<img src={Copy} alt="" onClick={() => copyToClipboard(address)} />}
                    on="click"
                  />
                </Header>
              </Grid.Column>
            </Grid>
            <Header style={(symbol === 'MANA' && !isMobile && { maxWidth: '500px' }) || {}}>
              {t('overview.details', {
                amount: formatNumber(Math.round(total), 0),
                token: symbol,
                months: vestingMonths,
                monthsPl: vestingMonths === 1 ? t('global.month') : t('global.month.plural'),
                cliff: vestingCliff,
                monthsCliffPl: vestingCliff === 1 ? t('global.month') : t('global.month.plural'),
              })}
            </Header>
          </Grid.Column>
          {symbol === 'MANA' && !isMobile && (
            <Grid.Column floated="right">
              <ManaWidget />
            </Grid.Column>
          )}
        </Grid.Row>
      </Grid>
    </>
  )
}
