import './Chart.css'
import React, { useEffect, useState } from 'react'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  LegendComponent,
  MarkLineComponent,
  TitleComponent,
  TooltipComponent,
  VisualMapComponent,
} from 'echarts/components'
import * as echarts from 'echarts/core'
import { UniversalTransition } from 'echarts/features'
import { SVGRenderer } from 'echarts/renderers'
import { formatDate, formatNumber } from 'decentraland-dapps/dist/lib/utils'
import { t } from 'decentraland-dapps/dist/modules/translation/utils'
import useResponsive, { onlyMobileMaxWidth } from '../../../hooks/useResponsive'
import { ContractVersion, TopicByVersion } from '../../../modules/constants'
import { DATE_FORMAT_SHORT } from '../../../utils'
import {
  DAY_IN_SECONDS,
  emptyDataArray,
  getCliffEndDay,
  getDaysFromRevoke,
  getDaysFromStart,
  getDurationInDays,
  toDataArray,
} from './utils'

function getRevokedData(revokeLog, start) {
  const isRevoked = revokeLog.length > 0
  const revokedDay = isRevoked ? getDaysFromRevoke(revokeLog[0].data.timestamp, start) : -1

  return [isRevoked, revokedDay]
}

function getPausedAndRevokedData(start, paused, revoked, stop) {
  return [revoked, revoked || paused ? getDaysFromRevoke(stop, start) : -1, paused]
}

function getXAxisData(start, duration) {
  const durationInDays = getDurationInDays(duration)

  const xData = toDataArray(durationInDays, (_x, i) =>
    formatDate(new Date((start + i * DAY_IN_SECONDS) * 1000).getTime(), DATE_FORMAT_SHORT)
  )

  return xData
}

function getVestingData(start, cliff, duration, total, isRevoked, revokeDay) {
  const cliffEndDay = getCliffEndDay(start, cliff)
  const durationInDays = getDurationInDays(duration)
  const vestingDays = isRevoked ? (revokeDay >= 0 ? revokeDay : 0) : durationInDays
  const totalVested = isRevoked && revokeDay > 0 ? (total / durationInDays) * revokeDay : total
  const vestedPerDay = totalVested / vestingDays

  let vestingData = new Array(cliffEndDay).fill(0)

  vestingData = vestingData.concat(
    toDataArray(vestingDays - cliffEndDay + 1, (_x, i) => Math.round(vestedPerDay * (cliffEndDay + i + 1) * 100) / 100)
  )

  if (isRevoked && revokeDay > 0) {
    vestingData = vestingData.concat(emptyDataArray(durationInDays - revokeDay))
  }

  return vestingData
}

function getVestingDataV2(start, cliff, duration, periodDuration, vestedPerPeriod, linear, isRevoked, revokeDay) {
  const cliffEndDay = getCliffEndDay(start, cliff)
  const durationInDays = getDurationInDays(duration)
  const vestingDays = isRevoked ? (revokeDay >= 0 ? revokeDay + 1 : 0) : durationInDays

  let vestingData = []

  if (!periodDuration) {
    return vestingData
  }

  // TODO: This can probably be optimized to avoid doing the same calculations for every day.
  for (let i = 0; i < vestingDays; i++) {
    let vestedThatDay

    if (i < cliffEndDay) {
      vestedThatDay = 0
    } else {
      const elapsedPeriods = (DAY_IN_SECONDS * i) / Number(periodDuration)
      const elapsedPeriodsTrunc = Math.trunc(elapsedPeriods)

      vestedThatDay = vestedPerPeriod.slice(0, elapsedPeriodsTrunc).reduce((a, b) => a + b, 0)

      if (linear && elapsedPeriodsTrunc < vestedPerPeriod.length) {
        const toVestThisPeriod = vestedPerPeriod[elapsedPeriodsTrunc]
        const elapsedPeriodsDecimals = elapsedPeriods % 1
        const vestedThisPeriod = toVestThisPeriod * elapsedPeriodsDecimals

        vestedThatDay += vestedThisPeriod
      }
    }

    vestingData.push(vestedThatDay)
  }

  if (isRevoked && revokeDay > 0) {
    vestingData = vestingData.concat(emptyDataArray(durationInDays - revokeDay))
  }

  return vestingData
}

function getReleaseData(start, cliff, releaseLogs, isRevokedOrPaused, revokeOrPauseDay) {
  if (new Date() < new Date(cliff * 1000)) {
    return []
  }

  const today = getDaysFromStart(start) + 1
  const cliffEndDay = getCliffEndDay(start, cliff)
  const releaseDays = releaseLogs.map((log) => Math.round((log.timestamp - start) / DAY_IN_SECONDS))

  if (releaseDays.length > 0) {
    let releaseData = emptyDataArray(cliffEndDay)
    releaseData = releaseData.concat(toDataArray(releaseDays[0] - cliffEndDay, () => 0))
    for (let i = 1; i < releaseDays.length; i++) {
      const { acum } = releaseLogs[i - 1]
      releaseData = releaseData.concat(
        toDataArray(releaseDays[i] - releaseDays[i - 1], () => Math.round(acum * 100) / 100)
      )
    }

    const finalDataPoint = isRevokedOrPaused ? revokeOrPauseDay + 1 : today

    const { acum } = releaseLogs[releaseLogs.length - 1]
    releaseData = releaseData.concat(
      toDataArray(finalDataPoint - releaseDays[releaseDays.length - 1], () => Math.round(acum * 100) / 100)
    )
    return releaseData
  }

  return emptyDataArray(isRevokedOrPaused ? revokeOrPauseDay + 1 : today)
}

function getLabelInterval(duration, isMobile) {
  if (isMobile) {
    return 'auto'
  }

  const durationInMonths = getDurationInDays(duration) / 30
  const maxLabels = 7

  return 30 * (durationInMonths <= maxLabels ? 1 : Math.ceil(durationInMonths / maxLabels))
}

function getTooltipFormatter(today, newName, args, symbol, ticker) {
  let tooltip = `<div class='tooltip'><p>${args[0].axisValue}</p><table>`

  const getFormattedValue = (value) => (isNaN(value) ? value : formatNumber(Math.round(value), 0))

  args.forEach(({ marker, seriesName, value }) => {
    const keepSeriesName = args[0].dataIndex < today || seriesName === t('chart.released')
    // prettier-ignore
    tooltip += `
    <tr>
      <td>${marker} ${keepSeriesName ? seriesName : newName}</td>
      <td>
        <div>
          <strong>${getFormattedValue(value)} ${symbol}</strong>
        </div>
        <div class='price ${symbol}'>
          ${getFormattedValue((value | 0) * ticker)} USD
        </div>
      </td>
    </tr>
    `
  })

  return tooltip + '</table></div>'
}

function resizeHandler(chart) {
  if (chart) {
    chart.resize()
  }
}

function getFormatterFn(tooltipDay, symbol, ticker) {
  return (args) => {
    return getTooltipFormatter(tooltipDay + 1, t('chart.to_be_vested'), args, symbol, symbol === 'MANA' ? ticker : 0)
  }
}

function Chart({ contract, ticker }) {
  const {
    version,
    symbol,
    start,
    cliff,
    duration,
    logs,
    vestedPerPeriod,
    periodDuration,
    linear,
    paused,
    revoked,
    stop,
    total,
  } = contract

  const today = Math.floor(new Date().getTime() / 1000)
  const daysFromStart = start > today ? 0 : getDaysFromStart(start)
  const Topic = TopicByVersion[version]

  const releaseLogs = logs.filter((log) => log.topic === Topic.RELEASE).map((log) => log.data)
  const revokeLog = logs.filter((log) => log.topic === Topic.REVOKE)

  let isRevoked, revokeOrPauseDay
  let isPaused = false

  if (version === ContractVersion.V1) {
    ;[isRevoked, revokeOrPauseDay] = getRevokedData(revokeLog, start)
  } else {
    ;[isRevoked, revokeOrPauseDay, isPaused] = getPausedAndRevokedData(start, paused, revoked, stop)
  }

  const isRevokedOrPaused = isRevoked || isPaused

  const responsive = useResponsive()
  const isMobile = responsive({ maxWidth: onlyMobileMaxWidth })
  const tooltipDay = isRevoked || isPaused ? revokeOrPauseDay : daysFromStart
  const getTodayMarkerColor = () => {
    if (revoked) {
      return 'var(--revoked-color)'
    } else if (paused) {
      return 'var(--paused-color)'
    }
    return 'var(--today-color)'
  }

  const option = {
    title: {
      text: t('chart.title'),
      textStyle: {
        fontSize: '13px',
      },
    },
    color: ['#44B600', '#FF7439'],
    tooltip: {
      trigger: 'axis',
      formatter: (args) =>
        getTooltipFormatter(tooltipDay + 1, t('chart.to_be_vested'), args, symbol, symbol === 'MANA' ? ticker : 0),
    },
    legend: {
      data: [t('chart.vested'), t('chart.released')],
    },
    grid: {
      left: '0',
      right: '0',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: getXAxisData(start, duration),
      axisLabel: {
        align: 'left',
        lineHeight: 30,
        color: '#B0AFB1',
        interval: getLabelInterval(duration, isMobile),
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value) => {
          if (!isMobile) {
            return `${formatNumber(value, 0)} ${symbol}`
          }

          const lookup = [
            { magnitude: 1, abv: '' },
            { magnitude: 1e3, abv: 'k' },
            { magnitude: 1e6, abv: 'M' },
            { magnitude: 1e9, abv: 'G' },
            { magnitude: 1e12, abv: 'T' },
            { magnitude: 1e15, abv: 'P' },
            { magnitude: 1e18, abv: 'E' },
          ]
          const magnitudes = lookup.map((obj) => obj.magnitude)
          const valueMag = 10 ** Math.floor(Math.log10(value))
          const diffArr = magnitudes.map((x) => Math.abs(valueMag - x))
          const minNumber = Math.min(...diffArr)
          const idx = diffArr.findIndex((x) => x === minNumber)

          return `${formatNumber(value / lookup[idx].magnitude, 0)}${lookup[idx].abv} ${symbol}`
        },
        inside: false,
        margin: 0,
        verticalAlign: 'bottom',
        showMinLabel: false,
        lineHeight: 30,
      },
    },
    series: [
      {
        name: t('chart.vested'),
        type: 'line',
        data:
          version === ContractVersion.V1
            ? getVestingData(start, cliff, duration, total, isRevoked, revokeOrPauseDay)
            : getVestingDataV2(
                start,
                cliff,
                duration,
                periodDuration,
                vestedPerPeriod,
                linear,
                isRevoked,
                revokeOrPauseDay
              ),
        symbol: 'none',
        markLine: {
          symbol: 'none',
          data: [
            {
              name: `${isRevoked ? t('chart.revoked') : isPaused ? t('chart.paused') : t('chart.today')}`,
              xAxis: isRevoked || isPaused ? revokeOrPauseDay : getDaysFromStart(start),
              label: {
                formatter: '{b}',
                show: true,
                color: 'white',
                backgroundColor: getTodayMarkerColor(),
                padding: [3, 6],
                borderRadius: 5,
              },
              lineStyle: {
                type: 'solid',
                color: getTodayMarkerColor(),
              },
            },
          ],
        },
      },
      {
        name: t('chart.released'),
        type: 'line',
        data: getReleaseData(start, cliff, releaseLogs, isRevokedOrPaused, revokeOrPauseDay),
        symbol: 'none',
      },
    ],
    visualMap: {
      type: 'piecewise',
      seriesIndex: 0,
      show: false,
      dimension: 0,
      pieces: [
        {
          lte: isRevoked || isPaused ? revokeOrPauseDay : daysFromStart,
          gt: -1000,
          color: '#44B600',
        },
        {
          gt: isRevoked || isPaused ? revokeOrPauseDay : daysFromStart,
          color: 'rgba(115, 110, 125, 0.3)',
        },
      ],
    },
  }

  const [fundsChart, setFundsChart] = useState(null)

  useEffect(() => {
    echarts.use([
      TitleComponent,
      TooltipComponent,
      GridComponent,
      LegendComponent,
      LineChart,
      SVGRenderer,
      UniversalTransition,
      VisualMapComponent,
      MarkLineComponent,
    ])

    const chartDom = document.getElementById('chart')
    setFundsChart(echarts.init(chartDom))
  }, [])

  useEffect(() => {
    window.onresize = () => resizeHandler(fundsChart)
  })

  useEffect(() => {
    if (fundsChart) {
      if (isMobile) {
        option.legend['top'] = 'bottom'
        option.grid.bottom = '10%'
      } else {
        option.legend['top'] = 'top'
        option.grid.bottom = '3%'
      }

      option.tooltip.formatter = getFormatterFn(tooltipDay, symbol, ticker)

      fundsChart.setOption(option, true)
    }
    // eslint-disable-next-line
  }, [isMobile, fundsChart, ticker])

  return <div id="chart" />
}

export default React.memo(Chart)
