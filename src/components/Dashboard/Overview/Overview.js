import React from "react";
import PropTypes from "prop-types";
import { Grid } from "semantic-ui-react";
import { Header, Popup } from "decentraland-ui";
import { FormattedMessage, FormattedPlural } from "react-intl";
import Copy from "../../../images/copy.svg";

import "./Overview.css";

Overview.propTypes = {
  address: PropTypes.string.isRequired,
};

export default function Overview(props) {
  const { address } = { ...props };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
  };

  return (
    <Grid columns={2} className="overview">
      <Grid.Row stretched>
        <Grid.Column floated="left">
          <div className="contract">
            <Header size="large">
              <FormattedMessage id="overview.title" />
            </Header>
            <Header sub>
              {address}{" "}
              <Popup
                content={<FormattedMessage id="global.copied" />}
                position="bottom center"
                trigger={<img src={Copy} onClick={copyAddress} />}
                on="Click"
              />
            </Header>
          </div>
          <Header style={{ maxWidth: "500px" }}>
            <FormattedMessage
              id="overview.details"
              values={{
                mana: 100,
                months: 2,
                monthsPl: (
                  <FormattedPlural
                    value={2}
                    one={<FormattedMessage id="global.month" />}
                    other={<FormattedMessage id="global.month.pl" />}
                  />
                ),
                cliff: 1,
                monthsCliffPl: (
                  <FormattedPlural
                    value={1}
                    one={<FormattedMessage id="global.month" />}
                    other={<FormattedMessage id="global.month.pl" />}
                  />
                ),
              }}
            />
          </Header>
        </Grid.Column>
        <Grid.Column floated="right">
          <div>aaa</div>
          <div>bbb</div>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
}
