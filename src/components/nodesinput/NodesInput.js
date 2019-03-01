import React from "react";
import PropTypes from "prop-types";
import "./nodesinput.scss";

NodesInput.propTypes = {
  setNumNodes: PropTypes.func.isRequired,
  initNum: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

NodesInput.defaultProps = {
  initNum: 100
};

function NodesInput(props) {
  const { initNum, setNumNodes } = props;
  return (
    <form
      className="nodes-input-container"
      onSubmit={e => {
        e.preventDefault();
        setNumNodes(e.target.amount.value);
      }}
    >
      <label htmlFor="amount">Number of Nodes:</label>
      <input
        type="text"
        id="amount"
        name="amount"
        required
        minLength="1"
        maxLength="8"
        size="10"
        defaultValue={initNum}
      />
      <button>Render</button>
    </form>
  );
}

export default NodesInput;
