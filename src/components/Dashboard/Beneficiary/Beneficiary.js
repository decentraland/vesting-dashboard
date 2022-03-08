import React, { useState, useEffect, useContext } from "react";
import { areSameAddress } from "../../../modules/ethereum/utils";
import { Grid } from "semantic-ui-react";
import Icon from "../../../images/grant_icon.svg";
import ButtonIcon from "../../../images/proposal_button_icon.svg";
import { Header, Button, Loader } from "decentraland-ui";
import { FormattedMessage } from "react-intl";
import useResponsive from "../../../hooks/useResponsive";
import Responsive from "semantic-ui-react/dist/commonjs/addons/Responsive";
import { DaoInitiativeContext } from "../../../context/DaoInitiativeContext";

import "./Beneficiary.css";

function Beneficiary(props) {
  const { address } = { ...props };

  const [proposals, setProposals] = useState(null);
  const [daoProposal, setDaoProposal] = useState(false);

  const handleClick = (event, url) => {
    window.open(url, "_blank").focus();
    event.preventDefault();
  };

  const responsive = useResponsive();
  const isMobile = responsive({ maxWidth: Responsive.onlyMobile.maxWidth });

  const { daoButton, setDaoButton } = useContext(DaoInitiativeContext);

  useEffect(() => {
    fetch(process.env.REACT_APP_GRANT_PROPOSALS_API_URL)
      .then((resp) => resp.json())
      .then((resp) => setProposals(resp.data))
      .catch((err) => console.log(err));
  }, []);

  useEffect(() => {
    if (!!proposals) {
      let proposal = proposals.filter((p) => areSameAddress(p["vesting_address"], address));
      let proposalUrl = null;
      if (proposal.length === 1) {
        proposal = proposal[0];
        proposalUrl = new URL(process.env.REACT_APP_PROPOSALS_URL);
        proposalUrl.searchParams.append("id", proposal.id);
        setDaoProposal(true);
      } else {
        throw new Error(<FormattedMessage id="error.dao_proposal_url" />);
      }

      setDaoButton(() => () => (
        <Button
          primary
          onClick={(e) => handleClick(e, proposalUrl)}
          href={proposalUrl}
          style={(isMobile && { padding: "10px" }) || {}}
        >
          <FormattedMessage id={isMobile ? "beneficiary.button.mobile" : "beneficiary.button"} />
          <img src={ButtonIcon} style={{ marginLeft: "8px" }} />
        </Button>
      ));
    }
  }, [proposals, address, isMobile]);

  return daoProposal ? (
    <div id="beneficiary">
      <Grid verticalAlign="middle">
        <Grid.Column style={{ width: "fit-content" }}>
          <img src={Icon} style={{ marginTop: "5px" }} />
        </Grid.Column>
        <Grid.Column width={isMobile ? 12 : 9}>
          <Header>
            <FormattedMessage id="beneficiary.title" />
          </Header>
          <Header sub>
            <FormattedMessage id="beneficiary.subtitle" />
          </Header>
        </Grid.Column>
        <Grid.Column className={isMobile ? "hidden" : "button__column"} floated="right" textAlign="right">
          {daoButton()}
        </Grid.Column>
      </Grid>
    </div>
  ) : (
    <></>
  );
}

export default Beneficiary;
