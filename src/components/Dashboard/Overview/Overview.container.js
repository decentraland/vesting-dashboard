import { connect } from "react-redux";
import { getAddress } from "modules/contract/selectors";
import Overview from "./Overview";
export const mapState = (state) => {
  return {
    address: getAddress(state),
  };
};

export const mapDispatch = (dispatch) => ({});

export default connect(mapState, mapDispatch)(Overview);
