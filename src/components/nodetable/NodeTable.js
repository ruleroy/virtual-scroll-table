import React from "react";
import {
  renderSortArrows,
  generateHeaders
} from "./tablefunctions/tableFunctions";
import sortType from "./tablefunctions/sortType";
import VirtualScroll from "./tablefunctions/VirtualScroll";
import PropTypes from "prop-types";

import "./nodetable.scss";

export default class NodeTable extends React.Component {
  static propTypes = {
    nodes: PropTypes.object.isRequired,
    colWidth: PropTypes.number,
    rowHeight: PropTypes.number
  };

  static defaultProps = {
    colWidth: 130,
    rowHeight: 40
  };

  constructor(props) {
    super(props);
    this.state = {
      sortByKey: "none",
      ascOrder: true,
      scrollLeft: 0,
      scrollTop: 0,
      aHeight: 0,
      aWidth: 0
    };
    this.buildTable = this.buildTable.bind(this);
    this.onHeaderClick = this.onHeaderClick.bind(this);
    this.handleScrollX = this.handleScrollX.bind(this);
    this.handleScrollY = this.handleScrollY.bind(this);
    this.handleWinResize = this.handleWinResize.bind(this);

    this.tableScrollX = null;
    this.setTableScrollX = element => {
      this.tableScrollX = element;
    };

    this.sortedNodes = Object.entries(props.nodes).sort(
      sortType(this.state.sortByKey, this.state.ascOrder)
    );
    this.setSortedNodes = nodes => {
      this.sortedNodes = nodes;
    };

    this.columns = [];
    this.setColumns = nodes => {
      this.columns = nodes;
    };

    this.vs = new VirtualScroll();
    this.setVS = (colWidth, rowHeight, colLength, rowLength) => {
      this.vs = new VirtualScroll(colWidth, rowHeight, colLength, rowLength);
    };
  }

  componentDidMount() {
    const { nodes, colWidth, rowHeight } = this.props;

    this.setColumns(generateHeaders(nodes)); //initial generate column headers
    this.setVS(
      colWidth,
      rowHeight,
      this.columns.length,
      Object.keys(nodes).length
    ); //initial set virtual scroll boundaries

    window.addEventListener("resize", this.handleWinResize);
    this.setTableScrollX(document.querySelector(".node-table-container > *"));
    this.tableScrollX.addEventListener("scroll", this.handleScrollX);
    this.handleWinResize();
  }

  componenetWillUnmount() {
    window.removeEventListener("resize", this.handleWinResize);
    this.tableScrollX.removeEventListener("scroll", this.handleScrollX);
  }

  //update ui when change amount of nodes
  componentDidUpdate(prevProps) {
    if (prevProps.nodes !== this.props.nodes) {
      const { nodes, colWidth, rowHeight } = this.props;

      this.setColumns(generateHeaders(nodes));
      this.setVS(
        colWidth,
        rowHeight,
        this.columns.length,
        Object.keys(nodes).length
      );

      this.setSortedNodes(
        Object.entries(this.props.nodes).sort(
          sortType(this.state.sortByKey, this.state.ascOrder)
        )
      );
      this.forceUpdate();
    }
  }

  handleScrollX(e) {
    const _this = this;

    function updateScrollX(e) {
      _this.setState(prevState => ({
        scrollLeft: e ? e.target.scrollLeft : 0
      }));
    }

    let newWidth =
      document.querySelector(".node-table").offsetWidth +
      this.tableScrollX.scrollLeft;
    document.querySelector(".node-table > tbody").style.width = newWidth + "px";
    updateScrollX(e);
  }

  onHeaderClick(key) {
    this.setState(prevState => {
      //toggles ascending order first for headers except itself clicked
      let newAscOrder =
        prevState.sortByKey === key ? !prevState.ascOrder : true;

      //sorts the data before finishing setstate to update ui
      this.setSortedNodes(
        Object.entries(this.props.nodes).sort(sortType(key, newAscOrder))
      );

      return {
        sortByKey: key,
        ascOrder: newAscOrder
      };
    });
  }

  handleWinResize(e) {
    this.setState({
      aHeight: document.querySelector(".node-table > tbody").offsetHeight,
      aWidth: document.querySelector(".node-table").offsetWidth
    });
  }

  handleScrollY(e) {
    this.setState({
      scrollTop: e.target.scrollTop
    });
  }

  buildTable() {
    let { nodes } = this.props;
    let {
      sortByKey,
      ascOrder,
      aHeight,
      aWidth,
      scrollLeft,
      scrollTop
    } = this.state;

    let _this = this;

    let scrollBottom = scrollTop + aHeight;
    let scrollRight = scrollLeft + aWidth;

    //index of columns to render
    let colStartIndex = Math.max(
      0,
      Math.floor(scrollLeft / this.vs.colWidth) - 5
    );
    let colEndIndex = Math.min(
      this.vs.colLength,
      Math.ceil(scrollRight / this.vs.colWidth) + 5
    );

    //index of rows to render
    let rowStartIndex = Math.max(
      0,
      Math.floor(scrollTop / this.vs.rowHeight) - 20
    );
    let rowEndIndex = Math.min(
      this.vs.rowLength,
      Math.ceil(scrollBottom / this.vs.rowHeight) + 20
    );

    function buildHeaders(columns) {
      return (
        <tr className="noselect">
          <th
            style={{
              minWidth: _this.vs.colWidth,
              height: _this.vs.rowHeight
            }}
            onClick={() => _this.onHeaderClick("index")}
          >
            <div className="col-text">(index)</div>
            {renderSortArrows("index", sortByKey, ascOrder)}
          </th>
          {buildCols("th", _this.columns)}
        </tr>
      );
    }

    //builds td or th columns for a table row
    function buildCols(type, columns, elements, rindex) {
      let cols = [];
      let cindex = colStartIndex;

      //only render specific column indexes for virtual scroll
      while (cindex < colEndIndex) {
        let colKey = columns[cindex];
        cols.push(
          type === "th" ? (
            <th
              key={`th-${cindex}`}
              onClick={() => _this.onHeaderClick(colKey)}
              style={{
                left: (cindex + 1) * _this.vs.colWidth + "px",
                minWidth: _this.vs.colWidth,
                height: _this.vs.rowHeight
              }}
            >
              <div className="col-text">{colKey}</div>
              {renderSortArrows(colKey, sortByKey, ascOrder)}
            </th>
          ) : (
            <td
              key={`i-${rindex}-${cindex}`}
              style={{
                left: (cindex + 1) * _this.vs.colWidth + "px",
                minWidth: _this.vs.colWidth,
                height: _this.vs.rowHeight
              }}
            >
              <div className="col-text">
                {elements[rindex][1][colKey] || ""}
              </div>
            </td>
          )
        );
        cindex++;
      }

      return cols;
    }

    function buildRows(nodes, columns) {
      let items = [];
      let rindex = rowStartIndex;

      //only render specific row indexes for virtual scroll
      while (rindex < rowEndIndex) {
        items.push(
          <tr
            key={`r-${rindex}`}
            style={{
              top: rindex * _this.vs.rowHeight + "px"
            }}
          >
            <td
              style={{
                minWidth: _this.vs.colWidth,
                height: _this.vs.rowHeight
              }}
            >
              <div className="col-text">
                <b>{_this.sortedNodes[rindex][0]}</b>
              </div>
            </td>
            {buildCols("td", _this.columns, _this.sortedNodes, rindex)}
          </tr>
        );
        rindex++;
      }
      return items;
    }

    //fills up space with getTotalWidth & getTotalHeight for the scrollbar
    return (
      <table className="node-table">
        <thead style={{ width: _this.vs.getTotalWidth() + "px" }}>
          {buildHeaders(this.columns)}
        </thead>
        <tbody onScroll={this.handleScrollY}>
          <tr
            className="row-container"
            style={{ height: this.vs.getTotalHeight() + "px" }}
          >
            {buildRows(nodes, this.columns)}
          </tr>
        </tbody>
      </table>
    );
  }

  render() {
    return <div className="node-table-container">{this.buildTable()}</div>;
  }
}
