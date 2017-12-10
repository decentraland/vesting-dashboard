import { connect } from "react-redux";
import { push } from "react-router-redux";
import { getName } from "modules/user/selectors";
import User from "./User";

const mapState = state => {
  return {
    name: getName(state)
  };
};

const mapDispatch = dispatch => ({
  goAbout: () => dispatch(push("/about"))
});

export default connect(mapState, mapDispatch)(User);
