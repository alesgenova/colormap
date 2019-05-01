import { ColorNode, RGBColor, Scale, ColorMap } from './types';
import { createColorMap, createColorMapFromColors, createColorMapFromColorNodes } from './mapping';
import { linearScale } from './scales';
import { toEachBeCloseTo } from './common.spec';

expect.extend({
  toEachBeCloseTo
});

const anyExpect = expect as any;

test('createColorMapFromColors', () => {
  let colors : RGBColor[];
  let scale: Scale;
  let colorMap: ColorMap;
  colors = [
    [0, 0, 0],
    [1, 1, 0]
  ];
  scale = linearScale([0, 100], [0, 1]);
  colorMap = createColorMap(colors, scale);
  expect(colorMap(0)).toEqual([0, 0, 0]);
  expect(colorMap(25)).toEqual([0.25, 0.25, 0]);
  expect(colorMap(75)).toEqual([0.75, 0.75, 0]);
  expect(colorMap(100)).toEqual([1.0, 1.0, 0]);
  expect(colorMap(200)).toEqual([1.0, 1.0, 0]);
  expect(colorMap(-100)).toEqual([0, 0, 0]);

  colors = [
    [0, 0, 0],
    [0.25, 0.25, 0],
    [1, 1, 0]
  ];
  scale = linearScale([0, 100], [0, 1]);
  colorMap = createColorMap(colors, scale);
  expect(colorMap(0)).toEqual([0, 0, 0]);
  expect(colorMap(25)).toEqual([0.125, 0.125, 0]);
  expect(colorMap(50)).toEqual([0.25, 0.25, 0]);
  expect(colorMap(75)).toEqual([0.625, 0.625, 0]);
  expect(colorMap(100)).toEqual([1.0, 1.0, 0]);
  expect(colorMap(200)).toEqual([1.0, 1.0, 0]);
  expect(colorMap(-100)).toEqual([0, 0, 0]);

  colorMap = createColorMapFromColors([], scale);
  expect(colorMap(0)).toEqual([0, 0, 0]);
  expect(colorMap(100)).toEqual([0, 0, 0]);
});

test('createColorMapFromColorNodes', () => {
  let colors : ColorNode[];
  let scale: Scale;
  let colorMap: ColorMap;
  colors = [
    {value: 0.0, color: [0, 0, 0]},
    {value: 0.25, color: [0.25, 0.25, 0]},
    {value: 1.0, color: [0, 1, 1]}
  ];
  scale = linearScale([0, 100], [0, 1]);
  colorMap = createColorMap(colors, scale);
  expect(colorMap(0)).toEqual([0, 0, 0]);
  expect(colorMap(12.5)).toEqual([0.125, 0.125, 0]);
  expect(colorMap(25)).toEqual([0.25, 0.25, 0]);
  anyExpect(colorMap(50)).toEachBeCloseTo([0.16666, 0.5, 0.33333], 5);
  anyExpect(colorMap(75)).toEachBeCloseTo([0.08333, 0.75, 0.66666], 5);
  expect(colorMap(100)).toEqual([0.0, 1.0, 1.0]);
  expect(colorMap(200)).toEqual([0.0, 1.0, 1.0]);
  expect(colorMap(-100)).toEqual([0, 0, 0]);

  colorMap = createColorMapFromColorNodes([], scale);
  expect(colorMap(0)).toEqual([0, 0, 0]);
  expect(colorMap(100)).toEqual([0, 0, 0]);
});
