import React, { useState, useEffect } from "react";
import { areSameAddress } from "../../../modules/ethereum/utils";
import { Grid } from "semantic-ui-react";
import Icon from "../../../images/grant_icon.svg";
import ButtonIcon from "../../../images/proposal_button_icon.svg";
import { Header, Button, Loader } from "decentraland-ui";

import "./Beneficiary.css";
import { FormattedMessage } from "react-intl";

function Beneficiary(props) {
  const { address } = { ...props };

  const [proposals, setProposals] = useState(null);
  const [daoProposal, setDaoProposal] = useState(null);

  const handleClick = (event) => {
    window.open(daoProposal, "_blank").focus();
    event.preventDefault();
  };

  useEffect(() => {
    fetch(process.env.REACT_APP_GRANT_PROPOSALS_URL)
      .then((resp) => resp.json())
      .then((resp) => setProposals(resp.data));
  }, []);

  useEffect(() => {
    if (!!proposals) {
      let proposal = proposals.filter((p) => areSameAddress(p["vesting_address"], address));
      if (proposal.length === 1) {
        proposal = proposal[0];
        setDaoProposal(proposal["snapshot_proposal"]["body"].match(/\bhttps?:\/\/\S+[^\)\*]/gi)[0]);
      }
    }
  }, [proposals]);

  return (
    <div id="beneficiary">
      <Grid verticalAlign="middle">
        <Grid.Column style={{ width: "fit-content" }}>
          <img src={Icon} style={{ marginTop: "5px" }} />
        </Grid.Column>
        <Grid.Column width={9}>
          <Header>
            <FormattedMessage id="beneficiary.title" />
          </Header>
          <Header sub>
            <FormattedMessage id="beneficiary.subtitle" />
          </Header>
        </Grid.Column>
        <Grid.Column style={{ width: "fit-content", paddingRight: "14px" }} floated="right" textAlign="right">
          {!!daoProposal ? (
            <Button primary onClick={handleClick} href={daoProposal}>
              <FormattedMessage id="beneficiary.button" />
              <img src={ButtonIcon} style={{ marginLeft: "8px" }} />
            </Button>
          ) : (
            <Button primary disabled>
              <Loader active size="mini" />
            </Button>
          )}
        </Grid.Column>
      </Grid>
    </div>
  );
}

export default Beneficiary;
