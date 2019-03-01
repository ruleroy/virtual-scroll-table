import React from "react";
import PropTypes from "prop-types";
import "./nodedesc.scss";

NodeDesc.propTypes = {
  nodes: PropTypes.object.isRequired,
  numNodes: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

function NodeDesc({ nodes, numNodes }) {
  const nEdges = Object.keys(nodes).reduce(
    (n, x) => n + Object.keys(nodes[x]).length,
    0
  );
  const nEdgesAvg = nEdges / numNodes;

  return (
    <div className="node-desc-container">
      {`${nEdges} edges ÷ ${numNodes} nodes ≈ ${nEdgesAvg.toFixed(
        2
      )} edges per node`}
    </div>
  );
}

export default NodeDesc;
