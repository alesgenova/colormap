[![CircleCI](https://circleci.com/gh/alesgenova/colormap/tree/master.svg?style=shield)](https://circleci.com/gh/alesgenova/colormap/tree/master)
[![codecov](https://codecov.io/gh/alesgenova/colormap/branch/master/graph/badge.svg)](https://codecov.io/gh/alesgenova/colormap)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/alesgenova/colormap.svg)](https://lgtm.com/projects/g/alesgenova/colormap/context:javascript)
[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)

# ColorMap
A flexible library to map numerical values to colors

<img src='img/demo.png'/>

## Packages
| Package | Version | Description |
| ------- | ------- |:-----:|
| [`@colormap/core`](packages/core) | [![npm package](https://img.shields.io/npm/v/@colormap/core.svg)](https://www.npmjs.com/package/@colormap/core) | Core functions and utilities
| [`@colormap/presets`](packages/presets) | [![npm package](https://img.shields.io/npm/v/@colormap/presets.svg)](https://www.npmjs.com/package/@colormap/presets) | Popular predefined colormaps

## Install
Install the `@colormap/core` package
```
npm install @colormap/core
```

Optionally install `@colormap/preset` to have popular colormaps from [matplotlib](https://matplotlib.org/tutorials/colors/colormaps.html) readily available
```
npm install @colormap/preset
```

## Basic Usage
```javascript
import { createColorMap, createOpacityMap, createColorOpacityMap, linearScale } from "@colormap/core";

let colors = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1]
];
let opacities = [1, 0, 1];
let domain = [0, 100];
let range = [0, 1];
let scale = linearScale(domain, range);
let colorMap = createColorMap(colors, scale);
let opacityMap = createOpacityMap(opacities, scale);
let colorOpacityMap = createColorOpacityMap(colorMap, opacityMap);
let values = [0, 25, 50, 75, 100];
console.log(values.map(v => colorMap(v)));
// [[1, 0, 0], [0.5, 0.5, 0], [0, 1, 0], [0, 0.5, 0.5], [0, 0, 1]]
console.log(values.map(v => opacityMap(v)));
// [1, 0.5, 0, 0.5, 1]
console.log(values.map(v => colorOpacityMap(v)));
// [[1, 0, 0, 1], [0.5, 0.5, 0, 0.5], [0, 1, 0, 0], [0, 0.5, 0.5, 0.5], [0, 0, 1, 1]]
```

## Advanced Usage
### Specify color/opacity maps by arbitrary nodes
Colors and opacities array don't necessarily need to span evenly the `[0, 1]` interval.
Maps can be generated from arbitrary nodes.
```javascript
import { createColorMap, linearScale } from "@colormap/core";

let colors = [
  { value: -1.0, mapped: [0, 0, 1] },
  { value: 0.0, mapped: [1, 0, 0] },
  { value: 0.5, mapped: [0, 1, 0] },
  { value: 2.0, mapped: [0, 0, 1] }
];
let domain = [0, 100];
let range = [-1, 2];
let scale = linearScale(domain, range);
let colorMap = createColorMap(colors, scale);
let values = [0, 25, 50, 75, 100];
console.log(values.map(v => colorMap(v)));
// [[0, 0, 1], [0.75, 0, 0.25], [0, 1, 0], [0, 0.5, 0.5], [0, 0, 1]]
```

### Node Mixers
When the scalar value is between two colormap nodes, we can have several strategies to mix the colors in the two nodes. By default a linear interpolation between nodes will be done. But this behavior can be overridden by passing a function as a third parameter to `createColorMap(colors, scale, mixer)`.

The signature of the mixer function is: `function(value: number, lowerNodeValue: number, upperNodeValue: number) : [number, number]`.

Four mixers are provided for convenience.
```javascript
import { linearMixer, roundMixer, floorMixer, ceilMixer } from '@colormap/core';

let colors = [[1, 0, 0], [1, 1, 0], [0, 1, 0], [0, 1, 1], [0, 0, 1]];
let scale = linearScale([0, 1], [0, 1]);
let colorMap = createColorMap(colors, scale, linearMixer);
```
Below is the effect these mixers have on the same 5-node colormap:
- `linearMixer` (default)
<img src='img/linear_mixer.png'/>

- `roundMixer`
<img src='img/round_mixer.png'/>

- `floorMixer`
<img src='img/floor_mixer.png'/>

- `ceilMixer`
<img src='img/ceil_mixer.png'/>

## Preset Colormaps
A set of popular colormaps from `matplotlib` are exported by the `@colormap/presets` package.
```javascript
import { createColorMap, linearScale } from "@colormap/core";
import { viridis, cividis, plasma, inferno, magma, blackWhite } from "@colormap/presets";

let scale = linearScale([0, 100], [0, 1]);
let colorMap = createColorMap(viridis, scale);
console.log([0, 100].map(v => colorMap(v)));
// [[0.267004, 0.004874, 0.329415], [0.993248, 0.906157, 0.143936]]
```

- `viridis`
<img src='img/viridis.png'/>

- `cividis`
<img src='img/cividis.png'/>

- `plasma`
<img src='img/plasma.png'/>

- `inferno`
<img src='img/inferno.png'/>

- `magma`
<img src='img/magma.png'/>

- `blackWhite`
<img src='img/blackWhite.png'/>
