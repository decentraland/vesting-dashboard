import moment from "moment";
import numeral from "numeral";

export const toDate = s => moment(s * 1000).format("dddd, MMM Do, YYYY");
export const toMANA = n => {
  return `${numeral(n / 1000000000000000000).format("0,0.00")} MANA`;
};

export const colors = {
  lightBlue: "#4db1dd",
  green: "#7fd135",
  darkGray: "#222222"
};
