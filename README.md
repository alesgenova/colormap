[![npm package](https://img.shields.io/npm/v/@colormap/core.svg)](https://www.npmjs.com/package/@colormap/core)
[![CircleCI](https://circleci.com/gh/alesgenova/colormap/tree/master.svg?style=shield)](https://circleci.com/gh/alesgenova/colormap/tree/master)
[![codecov](https://codecov.io/gh/alesgenova/colormap/branch/master/graph/badge.svg)](https://codecov.io/gh/alesgenova/colormap)

# color-mapping
A flexible library to map numerical values to colors

## Install
Install the `@colormap/core` package
```
npm install -S @colormap/core
```

Optionally install `@colormap/preset` to have popular colormaps from [matplotlib](https://matplotlib.org/tutorials/colors/colormaps.html) readily available
```
npm install -S @colormap/preset
```

## Basic Usage
```javascript
import { createColorMap, linearScale } from "@colormap/core";

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
import { createColorMap, linearScale } from "@colormap/core";

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

## Preset Colormaps
A set of popular colormaps from `matplotlib` are exported by the `@colormap/presets` package. See `packages/presets/src/index.ts` for a list of available presets.
```javascript
import { createColorMap, linearScale } from "@colormap/core";
import { VIRIDIS } from "@colormap/presets";

let domain = [0, 100];
let range = [0, 1];
let scale = linearScale(VIRIDIS, range);
let colorMap = createColorMap(colors, scale);
let output = [0, 1].map(v => colorMap(v));
// output is [[0.267004, 0.004874, 0.329415], [0.993248, 0.906157, 0.143936]]
```
