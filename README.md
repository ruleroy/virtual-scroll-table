# virtual-scroll-table
Demo built in react for virtual scrolling large amounts of data in a table.

See the demo in action: https://z23myy97mx.codesandbox.io/

## Features
- Display nodes in a table structure
- Sort nodes ascending/descending by clicking table headers
- Live modification for number of nodes to render
- Virtual scrolling implemented for X and Y scrolling for optimization
- Responsive web layout

## Config
You may manually modify ```config.js``` to change the number of nodes or seed parameters for the generateNodes function.

## Notes
- Larger the data, longer the initial load time. However, the application runs smoothly after loading.
