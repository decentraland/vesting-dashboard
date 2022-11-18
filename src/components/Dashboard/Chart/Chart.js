import './Chart.css'
import React, { useEffect, useState } from 'react'
import * as echarts from 'echarts/core'
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  VisualMapComponent,
  MarkLineComponent,
} from 'echarts/components'
import { LineChart } from 'echarts/charts'
import { UniversalTransition } from 'echarts/features'
import { SVGRenderer } from 'echarts/renderers'
import { useIntl } from 'react-intl'
import useResponsive from '../../../hooks/useResponsive'
import Responsive from 'semantic-ui-react/dist/commonjs/addons/Responsive'
import { TopicByVersion } from '../../../modules/constants'
import {
  DAY_IN_SECONDS,
  getDurationInDays,
  getDaysFromStart,
  getCliffEndDay,
  getDaysFromRevoke,
  toDataArray,
  emptyDataArray,
} from './utils'

function getRevokedData(revokeLog, start) {
  const isRevoked = revokeLog.length > 0
  const revokedDay = isRevoked
    ? getDaysFromRevoke(revokeLog[0].data.timestamp, start)
    : -1

  return [isRevoked, revokedDay]
}

function getXAxisData(start, duration, intl) {
  const durationInDays = getDurationInDays(duration)
  const dateOptions = { year: 'numeric', month: 'short', day: 'numeric' }

  const xData = toDataArray(durationInDays, (x, i) =>
    intl.formatDate(new Date((start + i * DAY_IN_SECONDS) * 1000), dateOptions)
  )

  return xData
}

function getVestingDataV2(
  start,
  cliff,
  duration,
  periodDuration,
  vestedPerPeriod
) {
  const cliffEndDay = getCliffEndDay(start, cliff)
  const vestingDays = getDurationInDays(duration)

  let vestingData = new Array(cliffEndDay).fill(0)

  return vestingData.concat(
    toDataArray(vestingDays - cliffEndDay, (_, i) => {
      const elapsedPeriods = Math.trunc(
        (DAY_IN_SECONDS * (cliffEndDay + i + 1)) / periodDuration
      )
      return vestedPerPeriod.slice(0, elapsedPeriods).reduce((a, b) => a + b, 0)
    })
  )
}

function getVestingData(start, cliff, duration, total, revokeLog) {
  const cliffEndDay = getCliffEndDay(start, cliff)
  const vestingDays = getDurationInDays(duration)
  const vestedPerDay = total / vestingDays

  const [isRevoked, revokedDay] = getRevokedData(revokeLog, start)

  let vestingData = new Array(cliffEndDay).fill(0)

  if (isRevoked) {
    if (revokedDay <= cliffEndDay) {
      vestingData = new Array(revokedDay).fill(0)
    } else {
      vestingData = vestingData.concat(
        toDataArray(
          revokedDay,
          (x, i) => Math.round(vestedPerDay * (cliffEndDay + i + 1) * 100) / 100
        )
      )
    }

    vestingData[vestingData.length - 1] = total

    return vestingData
  }

  return vestingData.concat(
    toDataArray(
      vestingDays - cliffEndDay,
      (x, i) => Math.round(vestedPerDay * (cliffEndDay + i + 1) * 100) / 100
    )
  )
}

function getReleaseData(start, cliff, releaseLogs, revokeLog) {
  if (new Date() < new Date(cliff * 1000)) {
    return []
  }

  const today = getDaysFromStart(start) + 1
  const cliffEndDay = getCliffEndDay(start, cliff)
  const releaseDays = releaseLogs.map((log) =>
    Math.ceil((log.timestamp - start) / DAY_IN_SECONDS)
  )

  if (releaseDays.length > 0) {
    let releaseData = emptyDataArray(cliffEndDay)
    releaseData = releaseData.concat(
      toDataArray(releaseDays[0] - cliffEndDay, (x, i) => 0)
    )
    for (let i = 1; i < releaseDays.length; i++) {
      const { acum } = releaseLogs[i - 1]
      releaseData = releaseData.concat(
        toDataArray(
          releaseDays[i] - releaseDays[i - 1],
          (x, i) => Math.round(acum * 100) / 100
        )
      )
    }

    const [isRevoked, revokedDay] = getRevokedData(revokeLog, start)
    const finalDataPoint = isRevoked ? revokedDay + 1 : today

    const { acum } = releaseLogs[releaseLogs.length - 1]
    releaseData = releaseData.concat(
      toDataArray(
        finalDataPoint - releaseDays[releaseDays.length - 1],
        (x, i) => Math.round(acum * 100) / 100
      )
    )
    return releaseData
  }

  return emptyDataArray(today)
}

function getLabelInterval(duration, isMobile) {
  if (isMobile) {
    return 'auto'
  }

  const durationInMonths = getDurationInDays(duration) / 30
  const maxLabels = 7

  return (
    30 *
    (durationInMonths <= maxLabels
      ? 1
      : Math.ceil(durationInMonths / maxLabels))
  )
}

function getTooltipFormatter(today, newName, intl, args, symbol, ticker) {
  let tooltip = `<div class='tooltip'><p>${args[0].axisValue}</p><table>`

  const getFormattedValue = (value) =>
    isNaN(value) ? value : intl.formatNumber(Math.round(value))

  args.forEach(({ marker, seriesName, value }) => {
    // prettier-ignore
    tooltip += `
    <tr>
      <td>${marker} ${args[0].dataIndex < today ? seriesName : newName}</td>
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

function Chart(props) {
  const { contract, ticker, version } = props
  const {
    symbol,
    released,
    balance,
    start,
    cliff,
    duration,
    logs,
    vestedPerPeriod,
    periodDuration,
  } = contract

  const total =
    version === 'v1'
      ? balance + released
      : vestedPerPeriod.reduce((a, b) => a + b, 0)
  const today = Math.floor(new Date().getTime() / 1000)
  const daysFromStart = start > today ? 0 : getDaysFromStart(start)
  const Topic = TopicByVersion[version]

  const releaseLogs = logs
    .filter((log) => log.topic === Topic.RELEASE)
    .map((log) => log.data)
  const revokeLog = logs.filter((log) => log.topic === Topic.REVOKE)
  const [isRevoked, revokedDay] = getRevokedData(revokeLog, start)

  const intl = useIntl()

  const responsive = useResponsive()
  const isMobile = responsive({ maxWidth: Responsive.onlyMobile.maxWidth })
  const toBeVestedLabel = intl.formatMessage({ id: 'chart.to_be_vested' })

  const option = {
    title: {
      text: intl.formatMessage({ id: 'chart.title' }),
      textStyle: {
        fontSize: '13px',
      },
    },
    color: ['#44B600', '#FF7439'],
    tooltip: {
      trigger: 'axis',
      formatter: (args) =>
        getTooltipFormatter(
          getDaysFromStart(start) + 1,
          toBeVestedLabel,
          intl,
          args,
          symbol,
          symbol === 'MANA' ? ticker : 0
        ),
    },
    legend: {
      data: [
        intl.formatMessage({ id: 'chart.vested' }),
        intl.formatMessage({ id: 'chart.released' }),
      ],
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
      data: getXAxisData(start, duration, intl),
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
            return `${intl.formatNumber(value)} ${symbol}`
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

          return `${intl.formatNumber(value / lookup[idx].magnitude)}${
            lookup[idx].abv
          } ${symbol}`
        },
        inside: true,
        margin: 0,
        verticalAlign: 'bottom',
        showMinLabel: false,
        lineHeight: 30,
      },
    },
    series: [
      {
        name: intl.formatMessage({ id: 'chart.vested' }),
        type: 'line',
        data:
          version === 'v1'
            ? getVestingData(start, cliff, duration, total, revokeLog)
            : getVestingDataV2(
                start,
                cliff,
                duration,
                periodDuration,
                vestedPerPeriod
              ),
        symbol: 'none',
        markLine: {
          symbol: 'none',
          data: [
            {
              name: `${
                isRevoked
                  ? intl.formatMessage({ id: 'chart.revoked' })
                  : intl.formatMessage({ id: 'chart.today' })
              }`,
              xAxis: isRevoked ? revokedDay : getDaysFromStart(start),
              label: {
                formatter: '{b}',
                show: true,
                color: 'white',
                backgroundColor: '#ff2d55',
                padding: [3, 6],
                borderRadius: 5,
              },
              lineStyle: {
                type: 'solid',
                color: '#ff2d55',
              },
            },
          ],
        },
      },
      {
        name: intl.formatMessage({ id: 'chart.released' }),
        type: 'line',
        data: getReleaseData(start, cliff, releaseLogs, revokeLog),
        symbol: 'none',
      },
    ],
  }

  if (!isRevoked) {
    option.visualMap = {
      type: 'piecewise',
      seriesIndex: 0,
      show: false,
      dimension: 0,
      pieces: [
        {
          lte: daysFromStart,
          gt: -1,
          color: '#44B600',
        },
        {
          gt: daysFromStart,
          color: 'rgba(115, 110, 125, 0.3)',
        },
      ],
    }
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
        option.legend.top = 'bottom'
        option.grid.bottom = '10%'
      } else {
        option.legend.top = 'top'
        option.grid.bottom = '3%'
      }

      fundsChart.setOption(option)
    }
    // eslint-disable-next-line
  }, [isMobile, fundsChart])

  return <div id="chart" />
}

export default React.memo(Chart)
