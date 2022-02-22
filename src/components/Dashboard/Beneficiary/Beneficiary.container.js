import { connect } from "react-redux";
import { getAddress } from "modules/contract/selectors";
import Beneficiary from "./Beneficiary";

export const mapState = (state) => {
  return {
    address: getAddress(state),
  };
};

export const mapDispatch = (dispatch) => ({});

export default connect(mapState, mapDispatch)(Beneficiary);
