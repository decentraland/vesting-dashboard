import merge from "lodash/merge";

const defaults = {
  method: "GET",
  headers: {
    "content-type": "application/json",
    accept: "application/json"
  }
};

export default class API {
  store = null;

  setStore = store => {
    this.store = store;
  };

  fetch = async (url, apiOptions = {}) => {
    const options = merge({}, defaults, apiOptions);
    return fetch(url, options);
  };
}
