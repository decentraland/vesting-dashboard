import { connect } from "react-redux";
import { getAddress } from "../../modules/ethereum/selectors";
import Header from "./Header";

export const mapState = state => {
  return {
    address: getAddress(state)
  };
};

export const mapDispatch = dispatch => ({});

export default connect(mapState, mapDispatch)(Header);
