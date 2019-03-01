import React from "react";
import NodeTable from "./components/nodetable/NodeTable";
import NodesInput from "./components/nodesinput/NodesInput";
import NodeDesc from "./components/nodedesc/NodeDesc";
import { nNodes, seed } from "./config";

export default class App extends React.Component {
  constructor() {
    super();

    this.state = {
      numNodes: nNodes
    };

    this.setNumNodes = this.setNumNodes.bind(this);
  }

  setNumNodes(amount) {
    this.setState({
      numNodes: amount
    });
  }

  render() {
    const { numNodes } = this.state;
    const nodes = generateNodes(numNodes, seed);

    return (
      <div className="App">
        <div className="author">Roy Vannakittikun</div>
        <NodesInput initNum={numNodes} setNumNodes={this.setNumNodes} />
        <NodeDesc nodes={nodes} numNodes={numNodes} />
        <NodeTable nodes={nodes} colWidth={130} rowHeight={40} />
      </div>
    );
  }
}
