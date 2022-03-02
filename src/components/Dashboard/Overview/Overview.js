import React from "react";
import { Grid } from "semantic-ui-react";
import { Header, Popup } from "decentraland-ui";
import { FormattedMessage, FormattedPlural, FormattedNumber } from "react-intl";
import { getMonthDiff } from "utils";
import ManaWidget from "../../ManaWidget";
import Copy from "../../../images/copy.svg";

import "./Overview.css";

export default function Overview(props) {
  const { address, contract } = { ...props };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
  };

  const { released, balance, start, cliff, duration } = contract;
  const total = balance + released;
  const vestingMonths = getMonthDiff(start, start + duration);
  const vestingCliff = getMonthDiff(start, cliff);

  return (
    <Grid columns={2} className="overview">
      <Grid.Row stretched>
        <Grid.Column floated="left">
          <div className="contract">
            <Header size="large">
              <FormattedMessage id="overview.title" values={{ token: contract.symbol }} />
            </Header>
            <Header sub>
              {address}{" "}
              <Popup
                content={<FormattedMessage id="global.copied" />}
                position="bottom center"
                trigger={<img src={Copy} onClick={copyAddress} />}
                on="click"
              />
            </Header>
          </div>
          <Header style={{ maxWidth: "500px" }}>
            <FormattedMessage
              id="overview.details"
              values={{
                amount: <FormattedNumber value={Math.round(total)} />,
                token: contract.symbol,
                months: vestingMonths,
                monthsPl: (
                  <FormattedPlural
                    value={vestingMonths}
                    one={<FormattedMessage id="global.month" />}
                    other={<FormattedMessage id="global.month.pl" />}
                  />
                ),
                cliff: vestingCliff,
                monthsCliffPl: (
                  <FormattedPlural
                    value={vestingCliff}
                    one={<FormattedMessage id="global.month" />}
                    other={<FormattedMessage id="global.month.pl" />}
                  />
                ),
              }}
            />
          </Header>
        </Grid.Column>
        <Grid.Column floated="right">
          <ManaWidget />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
