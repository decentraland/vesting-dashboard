import React, { Component } from "react";
import PropTypes from "prop-types";
import "./Row.css";

const propTypes = {
  label: PropTypes.string.isRequired
};

class Row extends Component {
  render() {
    const { label, children, title } = this.props;
    return (
      <span className="details-row" title={title}>
        <label className="details-label">{label}</label>
        <span className="details-value">{children}</span>
      </span>
    );
  }
}

Row.propTypes = propTypes;
export default Row;
