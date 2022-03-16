import "./Chart.css";
import React, { useEffect, useState } from "react";
import * as echarts from "echarts/core";
import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  VisualMapComponent,
  MarkLineComponent,
} from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { SVGRenderer } from "echarts/renderers";
import { useIntl } from "react-intl";
import useResponsive from "../../../hooks/useResponsive";
import Responsive from "semantic-ui-react/dist/commonjs/addons/Responsive";
import { DAY_IN_SECONDS, getDurationInDays, getDaysFromStart, getCliffEndDay, getDaysFromRevoke } from "./utils";
import { Topic } from "../../../modules/constants";

function getRevokedData(revokeLog, start) {
  const isRevoked = revokeLog.length > 0;
  const revokedDay = isRevoked ? getDaysFromRevoke(revokeLog[0].data.timestamp, start) : -1;

  return [isRevoked, revokedDay];
}

function getXAxisData(start, duration, intl, isMobile) {
  const durationInDays = getDurationInDays(duration);
  const dateOptions = { year: "numeric", month: "long", day: "numeric" };

  if (isMobile) {
    dateOptions.month = "short";
  }

  const xData = Array.from(new Array(durationInDays), (x, i) =>
    intl.formatDate(new Date((start + i * DAY_IN_SECONDS) * 1000), dateOptions)
  );

  return xData;
}

function getVestingData(start, cliff, duration, total, revokeLog) {
  const cliffEndDay = getCliffEndDay(start, cliff);
  const vestingDays = getDurationInDays(duration);
  const vestedPerDay = total / vestingDays;

  const [isRevoked, revokedDay] = getRevokedData(revokeLog, start);

  let vestingData = new Array(cliffEndDay).fill(0);

  if (isRevoked) {
    if (revokedDay <= cliffEndDay) {
      vestingData = new Array(revokedDay).fill(0);
    } else {
      vestingData = vestingData.concat(
        Array.from(new Array(revokedDay), (x, i) => Math.round(vestedPerDay * (cliffEndDay + i + 1) * 100) / 100)
      );
    }

    vestingData[vestingData.length - 1] = total;

    return vestingData;
  }

  return vestingData.concat(
    Array.from(
      new Array(vestingDays - cliffEndDay),
      (x, i) => Math.round(vestedPerDay * (cliffEndDay + i + 1) * 100) / 100
    )
  );
}

function getReleaseData(start, cliff, releaseLogs, revokeLog) {
  if (new Date() < new Date(cliff * 1000)) {
    return [];
  }

  const cliffEndDay = getCliffEndDay(start, cliff);
  const releaseDays = releaseLogs.map((log) => Math.ceil((log.timestamp - start) / DAY_IN_SECONDS));

  if (releaseDays.length > 0) {
    let releaseData = Array.from(new Array(cliffEndDay), (x, i) => "-");
    releaseData = releaseData.concat(Array.from(new Array(releaseDays[0] - cliffEndDay), (x, i) => 0));
    for (let i = 1; i < releaseDays.length; i++) {
      const { acum } = releaseLogs[i - 1];
      releaseData = releaseData.concat(
        Array.from(new Array(releaseDays[i] - releaseDays[i - 1]), (x, i) => Math.round(acum * 100) / 100)
      );
    }

    const [isRevoked, revokedDay] = getRevokedData(revokeLog, start);
    const finalDataPoint = isRevoked ? revokedDay + 1 : getDaysFromStart(start);

    const { acum } = releaseLogs[releaseLogs.length - 1];
    releaseData = releaseData.concat(
      Array.from(
        new Array(finalDataPoint - releaseDays[releaseDays.length - 1]),
        (x, i) => Math.round(acum * 100) / 100
      )
    );
    return releaseData;
  }

  return Array.from(new Array(getDaysFromStart(start)), (x, i) => "-");
}

function yAxisFormatter(totalVesting, symbol, isMobile) {
  if (isMobile) {
    if (totalVesting >= 1000000) {
      return (value) => `${value / 1000000}M ${symbol}`;
    }

    if (totalVesting >= 1000) {
      return (value) => `${value / 1000}k ${symbol}`;
    }
  }

  return `{value} ${symbol}`;
}

function resizeHandler(chart) {
  if (chart) {
    chart.resize();
  }
}

function Chart(props) {
  const { contract } = props;
  const { symbol, released, balance, start, cliff, duration, logs } = contract;
  const total = balance + released;
  const daysFromStart = getDaysFromStart(start) - 1;
  const releaseLogs = logs.filter((log) => log.topic === Topic.RELEASE).map((log) => log.data);
  const revokeLog = logs.filter((log) => log.topic === Topic.REVOKE);
  const [isRevoked, revokedDay] = getRevokedData(revokeLog, start);

  const intl = useIntl();

  const responsive = useResponsive();
  const isMobile = responsive({ maxWidth: Responsive.onlyMobile.maxWidth });

  const option = {
    title: {
      text: intl.formatMessage({ id: "chart.title" }),
      textStyle: {
        fontSize: "13px",
      },
    },
    color: ["#44B600", "#FF7439"],
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: [intl.formatMessage({ id: "chart.vested" }), intl.formatMessage({ id: "chart.released" })],
    },
    grid: {
      left: "0",
      right: "0",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: getXAxisData(start, duration, intl, isMobile),
      axisLabel: {
        align: "left",
        lineHeight: 30,
        color: "#B0AFB1",
      },
      axisTick: {
        show: false,
      },
    },
    yAxis: {
      type: "value",
      max: "dataMax",
      axisLabel: {
        formatter: function (value, index) {
          const lookup = [
            { value: 1, abv: "" },
            { value: 1e3, abv: "k" },
            { value: 1e6, abv: "M" },
            { value: 1e9, abv: "G" },
            { value: 1e12, abv: "T" },
            { value: 1e15, abv: "P" },
            { value: 1e18, abv: "E" },
          ];
          const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
          var item = lookup
            .slice()
            .reverse()
            .find(function (item) {
              return value >= item.value;
            });
          return item
            ? (value / item.value).toFixed(index).replace(rx, "$1") + item.abv + " " + symbol
            : "0" + " " + symbol;
        },
        inside: true,
        margin: 0,
        verticalAlign: "bottom",
        showMinLabel: false,
        lineHeight: 30,
      },
    },
    series: [
      {
        name: intl.formatMessage({ id: "chart.vested" }),
        type: "line",
        data: getVestingData(start, cliff, duration, total, revokeLog),
        symbol: "none",
        markLine: {
          symbol: "none",
          data: [
            {
              name: `${
                isRevoked ? intl.formatMessage({ id: "chart.revoked" }) : intl.formatMessage({ id: "chart.today" })
              }`,
              xAxis: isRevoked ? revokedDay : getDaysFromStart(start) - 1,
              label: {
                normal: {
                  formatter: "{b}",
                  show: true,
                  color: "white",
                  backgroundColor: "#ff2d55",
                  padding: [3, 6],
                  borderRadius: 5,
                },
              },
              lineStyle: {
                normal: {
                  type: "solid",
                  color: "#ff2d55",
                },
              },
            },
          ],
        },
      },
      {
        name: intl.formatMessage({ id: "chart.released" }),
        type: "line",
        data: getReleaseData(start, cliff, releaseLogs, revokeLog),
        symbol: "none",
      },
    ],
  };

  if (!isRevoked) {
    option.visualMap = {
      type: "piecewise",
      seriesIndex: 0,
      show: false,
      dimension: 0,
      pieces: [
        {
          lte: daysFromStart,
          gt: 0,
          color: "#44B600",
        },
        {
          gt: daysFromStart,
          color: "rgba(115, 110, 125, 0.3)",
        },
      ],
    };
  }

  const [fundsChart, setFundsChart] = useState(null);

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
    ]);

    const chartDom = document.getElementById("chart");
    setFundsChart(echarts.init(chartDom));
  }, []);

  useEffect(() => {
    window.onresize = () => resizeHandler(fundsChart);
  });

  useEffect(() => {
    if (fundsChart) {
      if (isMobile) {
        option.legend.top = "bottom";
        option.grid.bottom = "10%";
        option.yAxis.axisLabel.formatter = (value) => `${value / 1000}k ${symbol}`;
      } else {
        option.legend.top = "top";
        option.grid.bottom = "3%";
      }

      option.yAxis.axisLabel.formatter = yAxisFormatter(total, symbol, isMobile);
      fundsChart.setOption(option);
    }
  }, [isMobile, fundsChart]);

  return <div id="chart" />;
}

export default React.memo(Chart);
