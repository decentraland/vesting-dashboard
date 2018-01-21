import contract from "./contract/reducer";
import ethereum from "./ethereum/reducer";
import { combineReducers } from "redux";
export default combineReducers({
  contract,
  ethereum
});
