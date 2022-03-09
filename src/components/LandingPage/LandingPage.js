import { Logo } from "decentraland-ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Container } from "semantic-ui-react";
import { isValidAddress } from "../../utils";
import Input from "../Input";

function LandingPage(props) {
  const { stateAddress, isNotFound, address, network, handleAddressChange } = props;

  const intl = useIntl();

  let helpText = intl.formatMessage({ id: "helper.landing_page.continue" });
  if (!stateAddress) {
    helpText = intl.formatMessage({ id: "helper.landing_page.provide_contract" });
  } else if (!isValidAddress(stateAddress)) {
    helpText = intl.formatMessage({ id: "helper.landing_page.address_not_valid" });
  } else if (isNotFound && stateAddress === address) {
    helpText =
      intl.formatMessage("helper.landing_page.no_contract") +
      (network && network.name !== "mainnet"
        ? `\n${intl.formatMessage({ id: "helper.landing_page.network", values: { network: network.name } })}`
        : "");
  }

  return (
    <Container className="Landing">
      <Logo />
      <h3>
        <FormattedMessage id="landing_page.title" />
      </h3>
      <Input value={stateAddress} placeholder="0x..." onChange={handleAddressChange} />
      <p className="help">{helpText}</p>
    </Container>
  );
}

export default React.memo(LandingPage);
