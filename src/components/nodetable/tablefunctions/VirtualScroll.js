//class to store virtual scrolling boundaries
export default class VirtualScroll {
  constructor(colWidth, rowHeight, colLength, rowLength) {
    this.colWidth = colWidth;
    this.rowHeight = rowHeight;
    this.colLength = colLength;
    this.rowLength = rowLength;
  }

  setColWidth(width) {
    this.colWidth = width;
  }

  setColLength(length) {
    this.colLength = length;
  }

  setRowLength(length) {
    this.rowLength = length;
  }

  setRowHeight(height) {
    this.rowHeight = height;
  }

  getTotalHeight() {
    return this.rowLength * this.rowHeight;
  }

  getTotalWidth() {
    return this.colLength * this.colWidth;
  }
}
