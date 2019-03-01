import React from "react";

//renders sorting arrows based on column key
export function renderSortArrows(key, sortByKey, ascOrder) {
  return sortByKey === key ? (
    ascOrder ? (
      <div className="order-arrow">▲</div>
    ) : (
      <div className="order-arrow">▼</div>
    )
  ) : (
    false
  );
}

//takes in nodes object and outputs array of column headers
export function generateHeaders(nodes) {
  return Object.entries(nodes).reduce((arr, node) => {
    Object.keys(node[1]).forEach(item => {
      if (arr.indexOf(item) === -1) {
        arr.push(item);
      }
    });
    return arr;
  }, []);
}
