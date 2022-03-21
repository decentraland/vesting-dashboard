import { connect } from "react-redux";
import { getAddress, getContract } from "../../../modules/contract/selectors";
import { getTicker } from "../../../modules/ticker/selectors";
import Summary from "./Summary";
export const mapState = (state) => {
  return {
    address: getAddress(state),
    contract: getContract(state),
    ticker: getTicker(state),
  };
};

export default connect(mapState)(Summary);
