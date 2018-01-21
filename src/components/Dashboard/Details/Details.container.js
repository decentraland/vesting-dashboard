import { connect } from "react-redux";
import { release } from "modules/contract/actions";
import { getContract } from "modules/contract/selectors";
import { getAddress } from "modules/ethereum/selectors";
import Details from "./Details";

export const mapState = state => {
  const contract = getContract(state);
  const address = getAddress(state);
  console.log(contract.beneficiary, address, contract.beneficiary === address);
  return {
    contract,
    isBeneficiary: contract.beneficiary === address
  };
};

export const mapDispatch = dispatch => ({
  onRelease: () => dispatch(release())
});

export default connect(mapState, mapDispatch)(Details);
