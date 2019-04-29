[![npm package](https://img.shields.io/npm/v/color-mapping.svg)](https://www.npmjs.com/package/color-mapping)
[![CircleCI](https://circleci.com/gh/alesgenova/color-mapping/tree/master.svg?style=shield)](https://circleci.com/gh/alesgenova/color-mapping/tree/master)
[![codecov](https://codecov.io/gh/alesgenova/color-mapping/branch/master/graph/badge.svg)](https://codecov.io/gh/alesgenova/color-mapping)

# color-mapping
A flexible library to map numerical values to colors

## Install
```
npm install -S color-mapping
```

## Basic Usage
```javascript
import { createColorMap, linearScale } from "color-mapping";

let colors = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
];
let domain = [0, 100];
let range = [0, 1];
let scale = linearScale(domain, range);
let colorMap = createColorMap(colors, scale);
let values = [0, 25, 50, 75, 100];
let output = values.map(v => colorMap(v));
// output is [[1,0,0], [0.5,0.5,0], [0,1,0], [0,0.5,0.5], [0,0,1]]
```

## Advanced Usage
The colors array doesn't necessarily need to span evenly the `[0, 1]` interval.
```javascript
import { createColorMap, linearScale } from "color-mapping";

let colors = [
  { value: -1.0, color: [0, 0, 1] },
  { value: 0.0, color: [1, 0, 0] },
  { value: 0.5, color: [0, 1, 0] },
  { value: 2.0, color: [0, 0, 1] }
];
let domain = [0, 100];
let range = [-1, 2];
let scale = linearScale(domain, range);
let colorMap = createColorMap(colors, scale);
let values = [0, 25, 50, 75, 100];
let output = values.map(v => colorMap(v));
// output is [[0,0,1], [0.75,0,0.25], [0,1,0], [0,0.5,0.5], [0,0,1]]
```
