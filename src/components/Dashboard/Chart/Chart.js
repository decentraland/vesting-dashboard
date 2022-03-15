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

  const isRevoked = revokeLog.length > 0;
  const revokedDay = isRevoked ? getDaysFromRevoke(revokeLog[0].data.timestamp, start) : 0;

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
    Array.from(new Array(vestingDays), (x, i) => Math.round(vestedPerDay * (cliffEndDay + i + 1) * 100) / 100)
  );
}

function getReleaseData(start, cliff, releaseLogs) {
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

    const { acum } = releaseLogs[releaseLogs.length - 1];
    releaseData = releaseData.concat(
      Array.from(
        new Array(getDaysFromStart(start) - releaseDays[releaseDays.length - 1]),
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

    return (value) => `${value / 1000}k ${symbol}`;
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
  const isRevoked = revokeLog.length > 0;

  const intl = useIntl();

  const responsive = useResponsive();
  const isMobile = responsive({ maxWidth: Responsive.onlyMobile.maxWidth });

  const option = {
    title: {
      text: "FUNDS OVER TIME",
    },
    color: ["#44B600", "#FF7439"],
    tooltip: {
      trigger: "axis",
    },
    legend: {
      data: ["Vested", "Released"],
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: getXAxisData(start, duration, intl, isMobile),
    },
    yAxis: {
      type: "value",
      axisLabel: {
        formatter: `{value} ${symbol}`,
      },
    },
    series: [
      {
        name: "Vested",
        type: "line",
        data: getVestingData(start, cliff, duration, total, revokeLog),
        symbol: "none",
        markLine: {
          symbol: "none",
          data: [
            {
              name: `${isRevoked ? "REVOKED" : "TODAY"}`,
              xAxis: isRevoked ? getDaysFromRevoke(revokeLog[0].data.timestamp, start) : getDaysFromStart(start) - 1,
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
        name: "Released",
        type: "line",
        data: getReleaseData(start, cliff, releaseLogs),
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
          label: "Vested",
        },
        {
          gt: daysFromStart,
          color: "rgba(115, 110, 125, 0.3)",
          label: "To be vested",
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
